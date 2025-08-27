const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:5173', 'http://127.0.0.1:5173']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/busmanagement';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Bus Schema
const busSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  route: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'inactive'],
    default: 'active'
  },
  departureTime: {
    type: Date,
    required: true
  },
  stopBookingBefore: {
    type: Number,
    default: 30, // minutes before departure
    min: 0
  },
  seats: [{
    number: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['available', 'booked', 'maintenance'],
      default: 'available'
    },
    passengerName: {
      type: String,
      default: ''
    }
  }]
}, {
  timestamps: true
});

// Initialize seats when creating a new bus
busSchema.pre('save', function(next) {
  if (this.isNew && this.seats.length === 0) {
    for (let i = 1; i <= this.capacity; i++) {
      this.seats.push({
        number: i,
        status: 'available',
        passengerName: ''
      });
    }
  }
  next();
});

const Bus = mongoose.model('Bus', busSchema);

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email templates
const getContactEmailTemplate = (name, email, message) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { padding: 20px; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Form Submission - ADIBUS</h1>
        </div>
        <div class="content">
          <h2>Contact Details:</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <h2>Message:</h2>
          <p>${message}</p>
        </div>
        <div class="footer">
          <p>This message was sent from the ADIBUS contact form.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getConfirmationEmailTemplate = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #10b981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { padding: 20px; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Contacting ADIBUS</h1>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
          <p>Our team typically responds within 24-48 hours during business days.</p>
          <p>Best regards,<br>The ADIBUS Team</p>
        </div>
        <div class="footer">
          <p>ADIBUS - Your Trusted Bus Management System</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Get all buses
app.get('/api/buses', async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    res.json(buses);
  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({ error: 'Failed to fetch buses' });
  }
});

// Get single bus
app.get('/api/buses/:id', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }
    res.json(bus);
  } catch (error) {
    console.error('Error fetching bus:', error);
    res.status(500).json({ error: 'Failed to fetch bus' });
  }
});

// Create new bus
app.post('/api/buses', async (req, res) => {
  try {
    const { number, route, capacity, departureTime, stopBookingBefore } = req.body;
    
    // Validation
    if (!number || !route || !capacity || !departureTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const bus = new Bus({
      number,
      route,
      capacity: parseInt(capacity),
      departureTime: new Date(departureTime),
      stopBookingBefore: stopBookingBefore || 30
    });

    await bus.save();
    res.status(201).json(bus);
  } catch (error) {
    console.error('Error creating bus:', error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'Bus number already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create bus' });
    }
  }
});

// Update bus
app.put('/api/buses/:id', async (req, res) => {
  try {
    const { number, route, capacity, departureTime, stopBookingBefore, status } = req.body;
    
    const updateData = {
      number,
      route,
      capacity: parseInt(capacity),
      departureTime: new Date(departureTime),
      stopBookingBefore: stopBookingBefore || 30,
      status
    };

    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    res.json(bus);
  } catch (error) {
    console.error('Error updating bus:', error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'Bus number already exists' });
    } else {
      res.status(500).json({ error: 'Failed to update bus' });
    }
  }
});

// Update bus status
app.patch('/api/buses/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'maintenance', 'inactive'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    res.json(bus);
  } catch (error) {
    console.error('Error updating bus status:', error);
    res.status(500).json({ error: 'Failed to update bus status' });
  }
});

// Update seat status
app.patch('/api/buses/:id/seats/:seatIndex', async (req, res) => {
  try {
    const { status, passengerName } = req.body;
    const seatIndex = parseInt(req.params.seatIndex);

    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    if (seatIndex < 0 || seatIndex >= bus.seats.length) {
      return res.status(400).json({ error: 'Invalid seat index' });
    }

    bus.seats[seatIndex].status = status;
    if (passengerName !== undefined) {
      bus.seats[seatIndex].passengerName = passengerName;
    }

    await bus.save();
    res.json(bus);
  } catch (error) {
    console.error('Error updating seat:', error);
    res.status(500).json({ error: 'Failed to update seat' });
  }
});

// Update departure time
app.patch('/api/buses/:id/departure', async (req, res) => {
  try {
    const { departureTime } = req.body;

    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      { departureTime: new Date(departureTime) },
      { new: true }
    );

    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    res.json(bus);
  } catch (error) {
    console.error('Error updating departure time:', error);
    res.status(500).json({ error: 'Failed to update departure time' });
  }
});

// Update booking cutoff
app.patch('/api/buses/:id/booking-cutoff', async (req, res) => {
  try {
    const { stopBookingBefore } = req.body;

    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      { stopBookingBefore: parseInt(stopBookingBefore) },
      { new: true }
    );

    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    res.json(bus);
  } catch (error) {
    console.error('Error updating booking cutoff:', error);
    res.status(500).json({ error: 'Failed to update booking cutoff' });
  }
});

// Delete bus
app.delete('/api/buses/:id', async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }
    res.json({ message: 'Bus deleted successfully' });
  } catch (error) {
    console.error('Error deleting bus:', error);
    res.status(500).json({ error: 'Failed to delete bus' });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const transporter = createTransporter();

    // Send email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${name}`,
      html: getContactEmailTemplate(name, email, message)
    };

    // Send confirmation email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting ADIBUS',
      html: getConfirmationEmailTemplate(name)
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions)
    ]);

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});