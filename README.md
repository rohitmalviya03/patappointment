# Patient Appointment Booking System

A comprehensive multi-lab patient appointment booking system built with modern web technologies.

## 🏥 Overview

This system allows patients to:
- Register and manage their profiles
- Book appointments across multiple lab branches
- View available time slots
- Receive appointment confirmations
- Cancel or reschedule appointments

Lab administrators can:
- Manage lab branches and staff
- Set working hours and holidays
- Configure appointment slots
- View and manage appointments
- Generate reports

## 🚀 Tech Stack

### Backend
- **Node.js** with Express.js
- **MySQL** for database
- **JWT** for authentication
- **Sequelize** for ORM/data modeling

### Frontend
- **React.js** with modern hooks
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling

## 📁 Project Structure

```
patient-appointment-system/
├── backend/                 # Express.js API server
│   ├── models/             # Sequelize models
│   ├── routes/             # API endpoints
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth, validation, etc.
│   ├── config/             # Configuration files
│   └── server.js           # Entry point
│
├── frontend/               # React.js application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service calls
│   │   ├── context/        # React context for state
│   │   ├── utils/          # Utility functions
│   │   └── App.js          # Main app component
│   └── public/
│
└── README.md               # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (local installation or managed service)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables in .env
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new patient/admin
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Lab Endpoints
- `GET /api/labs` - Get all labs
- `GET /api/labs/:id` - Get specific lab details
- `POST /api/labs` - Create new lab (admin)
- `PUT /api/labs/:id` - Update lab (admin)
- `DELETE /api/labs/:id` - Delete lab (admin)

### Appointment Endpoints
- `GET /api/appointments` - Get user appointments
- `GET /api/appointments/availability/:labId` - Get available slots
- `POST /api/appointments` - Book appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Admin Endpoints
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/appointments` - All appointments
- `GET /api/admin/reports` - Generate reports

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication. Tokens are stored in localStorage and included in API requests via Authorization header.

## 📋 Features

### Patient Features
- ✅ User registration and login
- ✅ Profile management
- ✅ Multi-lab browsing
- ✅ Appointment booking with time slot selection
- ✅ Appointment history
- ✅ Cancel/reschedule appointments
- ✅ Email notifications

### Lab Administrator Features
- ✅ Manage multiple lab branches
- ✅ Set operating hours and holidays
- ✅ Configure appointment duration and capacity
- ✅ View all appointments
- ✅ Generate performance reports
- ✅ Manage staff and services

## 🔄 Development Workflow

1. **Install dependencies**: `npm install` from root
2. **Start backend**: `npm run dev:backend`
3. **Start frontend**: `npm run dev:frontend`
4. **Make changes** in respective folders
5. **Test** using API testing tools and browser
6. **Build** for production: `npm run build`

## 🧪 Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test
```

## 📦 Build & Deployment

```bash
# Build backend
cd backend && npm run build

# Build frontend
cd frontend && npm run build
```

## 🐛 Troubleshooting

### Port Already in Use
- Backend: Change PORT in `.env`
- Frontend: Set PORT environment variable

### Database Connection Error
- Check MySQL is running
- Verify `MYSQL_*` variables in `.env`

### CORS Issues
- Frontend and backend must be on different ports
- CORS is configured in backend

## 📄 License

MIT License

## 👥 Support

For issues and questions, please create an issue in the repository.

---

**Happy Coding!** 🎉
