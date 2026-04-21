# 🚀 Getting Started Guide

## Quick Start

### 1. Install MongoDB
First, you need MongoDB running on your system:

**Option A: Local Installation**
- Download from https://www.mongodb.com/try/download/community
- Install and start MongoDB service

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Copy your connection string
- Update `MONGODB_URI` in `backend/.env`

### 2. Start the Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

You should see:
```
✓ MongoDB connected successfully
🚀 Server running on http://localhost:5000
📍 API Endpoints:
   - Auth: /api/auth
   - Labs: /api/labs
   - Appointments: /api/appointments
```

### 3. Start the Frontend (in a new terminal)

```bash
cd frontend
npm start
```

The frontend will open automatically on `http://localhost:3000`

### 4. Test the Application

**Step 1: Register a Patient Account**
- Click "Register" 
- Fill in: Name, Email, Password
- Select "Patient" role
- Click Register

**Step 2: View Available Labs**
- You'll be redirected to Home
- You'll see a list of available labs (initially empty)

**Step 3: Add a Lab (as Admin)**
- Register another account and select "Admin" role
- Use API tools like Postman to create a lab:

```
POST http://localhost:5000/api/labs
Authorization: Bearer <your_admin_token>
Content-Type: application/json

{
  "name": "City Diagnostic Lab",
  "email": "lab@example.com",
  "phone": "123-456-7890",
  "services": ["Blood Test", "X-Ray", "COVID Test"],
  "address": {
    "street": "123 Health St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "workingHours": {
    "monday": { "start": "09:00", "end": "17:00" },
    "tuesday": { "start": "09:00", "end": "17:00" },
    "wednesday": { "start": "09:00", "end": "17:00" },
    "thursday": { "start": "09:00", "end": "17:00" },
    "friday": { "start": "09:00", "end": "17:00" },
    "saturday": { "start": "10:00", "end": "14:00" },
    "sunday": { "start": "closed", "end": "closed" }
  }
}
```

## 📚 API Endpoints Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Labs
- `GET /api/labs` - Get all labs
- `GET /api/labs/:id` - Get lab details
- `POST /api/labs` - Create lab (admin)
- `PUT /api/labs/:id` - Update lab (admin)
- `DELETE /api/labs/:id` - Delete lab (admin)

### Appointments
- `GET /api/appointments` - Get my appointments
- `POST /api/appointments` - Book appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

## 🛠️ Available Commands

**Root Directory:**
```bash
npm run dev:backend    # Start backend only
npm run dev:frontend   # Start frontend only
npm run dev            # Start both (requires concurrently)
npm run build          # Build both projects
```

**Backend:**
```bash
cd backend
npm run dev            # Development server with auto-reload
npm start              # Production server
npm test               # Run tests
```

**Frontend:**
```bash
cd frontend
npm start              # Development server
npm run build          # Build for production
npm test               # Run tests
```

## 💾 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/appointment-system
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Frontend (.env - optional)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🗂️ Project Structure

```
patient-appointment-system/
├── backend/
│   ├── models/              # Database models (User, Lab, Appointment)
│   ├── routes/              # API routes
│   ├── controllers/         # Business logic
│   ├── middleware/          # Auth, error handling
│   ├── config/              # Database config
│   ├── server.js            # Main server file
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, etc.
│   │   ├── pages/           # Home, Login, Register, Appointments
│   │   ├── services/        # API calls
│   │   ├── context/         # AuthContext
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── package.json             # Root package.json
├── README.md
└── .gitignore
```

## 🐛 Troubleshooting

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Set `PORT=3001` before running

### MongoDB Connection Error
- Check MongoDB is running
- Verify connection string in `.env`

### CORS Error
- Ensure backend is running on port 5000
- Ensure frontend is running on port 3000

### Module Not Found
- Run `npm install` in the respective folder
- Delete `node_modules` and run `npm install` again

## 📱 Testing with Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Import API endpoints
3. Set up environment variables with your token from login response

Example Login Request:
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "your@email.com",
  "password": "yourpassword"
}
```

Save the token from response and use in Authorization header for other requests.

## 🚢 Deployment

### Backend (Node.js)
- Deploy to Heroku, Railway, Render, or other Node.js hosting
- Set environment variables on the platform
- Ensure MongoDB access from cloud

### Frontend (React)
- Build: `npm run build`
- Deploy to Vercel, Netlify, GitHub Pages
- Update `REACT_APP_API_URL` to production API URL

## 📝 Next Steps

1. **Implement Appointment Slots** - Generate realistic time slots based on lab hours
2. **Email Notifications** - Send confirmation emails
3. **Payment Integration** - Add Stripe/PayPal
4. **Reporting** - Generate appointment reports
5. **Notifications** - Real-time updates with WebSocket
6. **Mobile App** - React Native version
7. **Testing** - Unit and integration tests
8. **Security** - Rate limiting, input validation

## ❓ Questions?

Check the individual README files:
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

---

Happy coding! 🎉
