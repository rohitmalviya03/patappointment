# Patient Appointment Booking System - Development Guidelines

## Project Overview
Multi-lab patient appointment booking system built with Node.js (Express) backend and React.js frontend.

## Technology Stack
- **Backend**: Node.js, Express.js, MongoDB/Mongoose
- **Frontend**: React.js, Axios, React Router
- **Authentication**: JWT
- **Database**: MongoDB
- **Build Tool**: npm

## Project Structure
```
.
├── backend/          # Express.js REST API
├── frontend/         # React.js SPA
└── package.json      # Root package.json for monorepo management
```

## Development Setup

### Prerequisites
- Node.js >= 14.x
- MongoDB (local or Atlas)
- npm or yarn

### Installation
1. Install dependencies: `npm install`
2. Setup environment variables in backend/.env
3. Start backend: `npm run dev:backend`
4. Start frontend: `npm run dev:frontend`

## Key Features
- Multi-lab management with branch selection
- Patient registration and authentication
- Appointment scheduling with real-time availability
- Lab calendar and time slot management
- Admin dashboard for lab managers
- Email notifications
- Responsive UI

## Development Commands
- `npm install` - Install all dependencies
- `npm run dev:backend` - Start backend server
- `npm run dev:frontend` - Start React dev server
- `npm run build` - Build both projects
- `npm run lint` - Run linting

## API Endpoints
All endpoints documented in backend/README.md

## Guidelines
- Follow RESTful API conventions
- Use environment variables for configuration
- Implement proper error handling
- Add validation for user inputs
- Use JWT for authentication
