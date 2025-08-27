const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/busmanagement', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Bus Schema
const busSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  route: { type: String, required: true },
  capacity: { type: Number, required: true },
  status: { type: String, enum: ['active', 'maintenance', 'inactive'], default: 'active' },
  departureTime: { type: Date, default: Date.now },
  stopBookingBefore: { type: Number, default: 30 },
  seats: [{
    seatNumber: Number,
    status: { type: String, enum: ['available', 'locked', 'booked'], default: 'available' }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Bus = mongoose.model('Bus', busSchema);

// Nodemailer configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Routes

// Get all buses
app.get('/api/buses', async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching buses', error: error.message });
  }
});

// Get single bus
app.get('/api/buses/:id', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bus', error: error.message });
  }
});

// Create new bus
app.post('/api/buses', async (req, res) => {
  try {
    const { number, route, capacity, status } = req.body;
    
    // Check if bus number already exists
    const existingBus = await Bus.findOne({ number });
    if (existingBus) {
      return res.status(400).json({ message: 'Bus number already exists' });
    }

    // Create seats array
    const seats = Array.from({ length: capacity }, (_, index) => ({
      seatNumber: index + 1,
      status: 'available'
    }));

    const newBus = new Bus({
      number,
      route,
      capacity,
      status,
      seats,
      departureTime: new Date(),
      stopBookingBefore: 30
    });

    const savedBus = await newBus.save();
    res.status(201).json(savedBus);
  } catch (error) {
    res.status(400).json({ message: 'Error creating bus', error: error.message });
  }
});

// Update bus
app.put('/api/buses/:id', async (req, res) => {
  try {
    const updatedBus = await Bus.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!updatedBus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    
    res.json(updatedBus);
  } catch (error) {
    res.status(400).json({ message: 'Error updating bus', error: error.message });
  }
});

// Update bus status
app.patch('/api/buses/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedBus = await Bus.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    
    if (!updatedBus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    
    res.json(updatedBus);
  } catch (error) {
    res.status(400).json({ message: 'Error updating bus status', error: error.message });
  }
});

// Update seat status
app.patch('/api/buses/:id/seats/:seatIndex', async (req, res) => {
  try {
    const { id, seatIndex } = req.params;
    const { status } = req.body;
    
    const bus = await Bus.findById(id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    
    if (seatIndex >= bus.seats.length) {
      return res.status(400).json({ message: 'Invalid seat index' });
    }
    
    bus.seats[seatIndex].status = status;
    bus.updatedAt = new Date();
    
    const updatedBus = await bus.save();
    res.json(updatedBus);
  } catch (error) {
    res.status(400).json({ message: 'Error updating seat status', error: error.message });
  }
});

// Update departure time
app.patch('/api/buses/:id/departure', async (req, res) => {
  try {
    const { departureTime } = req.body;
    const updatedBus = await Bus.findByIdAndUpdate(
      req.params.id,
      { departureTime, updatedAt: new Date() },
      { new: true }
    );
    
    if (!updatedBus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    
    res.json(updatedBus);
  } catch (error) {
    res.status(400).json({ message: 'Error updating departure time', error: error.message });
  }
});

// Update booking cutoff time
app.patch('/api/buses/:id/booking-cutoff', async (req, res) => {
  try {
    const { stopBookingBefore } = req.body;
    const updatedBus = await Bus.findByIdAndUpdate(
      req.params.id,
      { stopBookingBefore, updatedAt: new Date() },
      { new: true }
    );
    
    if (!updatedBus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    
    res.json(updatedBus);
  } catch (error) {
    res.status(400).json({ message: 'Error updating booking cutoff', error: error.message });
  }
});

// Delete bus
app.delete('/api/buses/:id', async (req, res) => {
  try {
    const deletedBus = await Bus.findByIdAndDelete(req.params.id);
    if (!deletedBus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.json({ message: 'Bus deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting bus', error: error.message });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #7f8c8d; font-size: 14px;">
            This message was sent from the ADIBUS contact form.
          </p>
        </div>
      `
    };

    // Confirmation email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting ADIBUS',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
            Thank You for Contacting Us!
          </h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>Dear ${name},</p>
            <p>Thank you for reaching out to ADIBUS. We have received your message and will get back to you as soon as possible.</p>
            <p><strong>Your message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; margin: 10px 0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <p>We typically respond within 24-48 hours during business days.</p>
          </div>
          <div style="background: linear-gradient(135deg, #3498db, #2c3e50); color: white; padding: 20px; border-radius: 8px; text-align: center;">
            <h3>ADIBUS</h3>
            <p>Your trusted bus operation management partner</p>
          </div>
        </div>
      `
    };

    // Send emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.json({ 
      message: 'Message sent successfully! We will get back to you soon.',
      success: true 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      message: 'Failed to send message. Please try again later.',
      error: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;