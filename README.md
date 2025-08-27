# ADIBUS - Bus Management System

A comprehensive bus management system with operator dashboard and backend integration.

## Features

### Frontend (React + Vite)
- **Bus Management**: Add, edit, delete, and manage bus fleet
- **Seat Management**: Real-time seat status management with visual interface
- **Price Management**: Dynamic pricing for different routes
- **Contact Form**: Integrated with email notifications
- **Responsive Design**: Works on all device sizes

### Backend (Express + MongoDB)
- **RESTful API**: Complete CRUD operations for buses
- **Email Integration**: Nodemailer for contact form submissions
- **Database**: MongoDB with Mongoose ODM
- **Error Handling**: Comprehensive error handling and validation

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Gmail account for email functionality

### Installation

1. **Clone and install dependencies:**
```bash
npm install
cd server && npm install
```

2. **Environment Configuration:**
Create a `.env` file in the root directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/busmanagement

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@adibus.com

# Server
PORT=3000
NODE_ENV=development
```

3. **Gmail Setup for Email:**
   - Enable 2-factor authentication on your Gmail account
   - Generate an App Password: Google Account → Security → App passwords
   - Use the generated password in `EMAIL_PASS`

4. **Start MongoDB:**
```bash
# If using local MongoDB
mongod
```

5. **Run the application:**
```bash
# Development mode (runs both frontend and backend)
npm run dev:full

# Or run separately:
# Frontend only
npm run dev

# Backend only
npm run dev:server
```

## API Endpoints

### Bus Management
- `GET /api/buses` - Get all buses
- `GET /api/buses/:id` - Get single bus
- `POST /api/buses` - Create new bus
- `PUT /api/buses/:id` - Update bus
- `PATCH /api/buses/:id/status` - Update bus status
- `PATCH /api/buses/:id/seats/:seatIndex` - Update seat status
- `PATCH /api/buses/:id/departure` - Update departure time
- `PATCH /api/buses/:id/booking-cutoff` - Update booking cutoff
- `DELETE /api/buses/:id` - Delete bus

### Contact
- `POST /api/contact` - Send contact form email

### Health Check
- `GET /api/health` - Server health status

## Project Structure

```
Frontend-Operator/
├── src/
│   ├── components/
│   │   ├── BusManage.jsx     # Bus management with backend integration
│   │   ├── About.jsx         # About page with contact form
│   │   ├── Home.jsx          # Dashboard home
│   │   ├── PriceManage.jsx   # Price management
│   │   └── ...
│   ├── context/
│   │   └── BusContext.jsx    # Global state management
│   └── ...
├── server/
│   ├── server.js             # Express server with all routes
│   └── package.json          # Backend dependencies
├── .env                      # Environment variables
└── package.json              # Frontend dependencies
```

## Features in Detail

### Bus Management
- **Real-time Updates**: All changes are immediately saved to database
- **Seat Management**: Visual seat grid with status management
- **Schedule Control**: Set departure times and booking cutoffs
- **Status Management**: Active, maintenance, inactive states

### Email System
- **Contact Form**: Sends emails to admin and confirmation to user
- **HTML Templates**: Professional email templates
- **Error Handling**: Graceful error handling for email failures

### Database Schema
```javascript
Bus Schema:
- number: String (unique)
- route: String
- capacity: Number
- status: String (active/maintenance/inactive)
- departureTime: Date
- stopBookingBefore: Number (minutes)
- seats: Array of seat objects
- createdAt/updatedAt: Timestamps
```

## Development

### Adding New Features
1. **Frontend**: Add components in `src/components/`
2. **Backend**: Add routes in `server/server.js`
3. **Database**: Extend schemas as needed

### Testing
- Frontend: `npm run dev`
- Backend: `npm run dev:server`
- Full stack: `npm run dev:full`

## Production Deployment

1. **Build frontend:**
```bash
npm run build
```

2. **Set production environment variables**

3. **Deploy backend to your preferred platform**

4. **Serve built frontend files**

## Support

For issues and questions, use the contact form in the application or reach out to the development team.

## License

MIT License - see LICENSE file for details.