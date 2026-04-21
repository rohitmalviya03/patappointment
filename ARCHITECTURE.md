# System Architecture & Features

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Patient Browser                        │
│                    (React.js Frontend)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  React App (Port 3000)                │  │
│  │  - Authentication (Login/Register)                    │  │
│  │  - Lab Browsing & Search                              │  │
│  │  - Appointment Booking                                │  │
│  │  - Appointment History                                │  │
│  │  - Real-time Updates                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTP/REST API
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Express.js Backend                        │
│                     (Node.js Port 5000)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            REST API Server                            │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Routes:                                       │  │  │
│  │  │  - /api/auth (Register, Login)                │  │  │
│  │  │  - /api/labs (CRUD operations)                │  │  │
│  │  │  - /api/appointments (Booking, Mgmt)          │  │  │
│  │  │  - /api/admin (Dashboard)                     │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Middleware:                                   │  │  │
│  │  │  - JWT Authentication                         │  │  │
│  │  │  - Error Handling                             │  │  │
│  │  │  - CORS Support                               │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                    MongoDB Driver
                            │
┌─────────────────────────────────────────────────────────────┐
│                   MongoDB Database                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Collections:                                        │  │
│  │  - users (Patients, Admins)                          │  │
│  │  - labs (Lab Branches)                               │  │
│  │  - appointments (Bookings)                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Backend Structure

### Models
```
User
├── name (string)
├── email (string, unique)
├── password (hashed)
├── phone (string)
├── role (patient/admin)
└── timestamps

Lab
├── name (string)
├── email (string)
├── phone (string)
├── address (object)
├── services (array)
├── workingHours (object)
├── admin (ref to User)
└── timestamps

Appointment
├── patient (ref to User)
├── lab (ref to Lab)
├── service (string)
├── appointmentDate (date)
├── startTime (string)
├── endTime (string)
├── status (scheduled/completed/cancelled)
└── timestamps
```

### Routes & Controllers
```
/api/auth
├── POST /register
└── POST /login

/api/labs
├── GET / (public)
├── GET /:id (public)
├── POST / (admin)
├── PUT /:id (admin)
└── DELETE /:id (admin)

/api/appointments
├── GET / (authenticated)
├── GET /availability/:labId (public)
├── POST / (authenticated)
├── PUT /:id (authenticated)
└── DELETE /:id (authenticated)
```

## 🎨 Frontend Components

### Pages
- **Home** - Browse available labs
- **Login** - User authentication
- **Register** - New user registration
- **Appointments** - View and manage appointments

### Components
- **Navbar** - Navigation and user menu
- **LabCard** - Display lab information
- **AppointmentCard** - Display appointment details
- **Forms** - Login/Register forms

### Context
- **AuthContext** - Global authentication state
  - User data
  - Token management
  - Login/Logout functions

### Services
- **API Service** - Axios configured for backend
  - Auth endpoints
  - Lab endpoints
  - Appointment endpoints

## ✨ Features Implemented

### Patient Features
- ✅ User Registration (with role selection)
- ✅ User Login (JWT-based)
- ✅ Browse Available Labs
- ✅ View Lab Details
- ✅ View Appointment History
- ✅ Cancel Appointments
- ✅ Protected Routes
- ✅ Automatic Logout

### Admin Features
- ✅ Create Lab Branches
- ✅ Update Lab Information
- ✅ Manage Services
- ✅ Set Working Hours and Holidays
- ✅ Configure Appointment Duration
- ✅ Delete Lab (soft delete)

### System Features
- ✅ JWT Token-based Authentication
- ✅ Password Hashing (bcryptjs)
- ✅ CORS Support
- ✅ Error Handling
- ✅ Request Validation
- ✅ MongoDB Integration
- ✅ Responsive UI Design

## 🔐 Security Features

1. **Password Security**
   - Passwords hashed with bcryptjs
   - Salt rounds: 10
   - Never stored in plain text

2. **Authentication**
   - JWT tokens with 7-day expiration
   - Token stored in localStorage
   - Token included in API requests

3. **Authorization**
   - Role-based access control
   - Protected routes
   - Admin-only endpoints

4. **Data Validation**
   - Email validation
   - Required field validation
   - MongoDB schema validation

5. **Error Handling**
   - Comprehensive error messages
   - Proper HTTP status codes
   - Request validation middleware

## 📊 Data Flow

### User Registration Flow
```
User Input (Register Form)
        ↓
Validate Input
        ↓
Check Email Uniqueness
        ↓
Hash Password
        ↓
Create User in Database
        ↓
Generate JWT Token
        ↓
Return Token + User Data
        ↓
Store in localStorage
        ↓
Redirect to Home
```

### Appointment Booking Flow
```
User Selects Lab
        ↓
Select Date & Time
        ↓
Choose Service
        ↓
Submit Booking
        ↓
Validate Slot Availability
        ↓
Check Lab Capacity
        ↓
Create Appointment
        ↓
Save to Database
        ↓
Return Confirmation
        ↓
Update UI
```

## 🎯 Key Technologies

### Backend
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM (Object Data Modeling)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-Origin Resource Sharing
- **Nodemon** - Development auto-reload

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **React Context** - State management
- **Axios** - HTTP client
- **CSS3** - Styling

## 🚀 Deployment Considerations

### Backend
- Environment variables for sensitive data
- MongoDB Atlas for cloud database
- Node.js hosting (Heroku, Railway, Render)
- Health check endpoint
- Error logging system

### Frontend
- Environment variables for API URL
- Build optimization
- Static hosting (Vercel, Netlify)
- Responsive design
- Progressive Web App (PWA) ready

## 📈 Future Enhancements

1. **Appointment Slots**
   - Implement time slot generation
   - Auto-refresh availability
   - Slot capacity management

2. **Notifications**
   - Email confirmations
   - SMS reminders
   - Push notifications

3. **Payment Integration**
   - Stripe/PayPal integration
   - Payment status tracking
   - Invoice generation

4. **Advanced Features**
   - Doctor/Staff management
   - Service/Test categories
   - Lab reports upload
   - Review & Rating system
   - Analytics dashboard

5. **Mobile App**
   - React Native app
   - Native push notifications
   - Biometric authentication

6. **DevOps**
   - Docker containerization
   - CI/CD pipeline
   - Automated testing
   - Monitoring & Logging

## 🧪 Testing Strategy

1. **Unit Tests**
   - Model validation tests
   - Service function tests
   - Component render tests

2. **Integration Tests**
   - API endpoint tests
   - Database operations
   - Authentication flow

3. **E2E Tests**
   - User workflows
   - Appointment booking flow
   - Admin operations

---

This architecture provides a scalable, secure, and maintainable foundation for a multi-lab appointment booking system.
