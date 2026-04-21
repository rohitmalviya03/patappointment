# Backend API Server

Patient Appointment Booking System - Node.js Express Server

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3333
MYSQL_DATABASE=appointment_system
MYSQL_USER=root
MYSQL_PASSWORD=
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## Installation

```bash
npm install
```

## Initialize MySQL Schema (Create All Tables)

```bash
npm run db:init
```

This command creates the configured MySQL database (if missing) and all required tables using `sql/schema.sql`.

## Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Documentation

See the main README.md for complete API documentation.

## Folder Structure

- `models/` - Database schemas (User, Lab, Appointment, etc.)
- `routes/` - API route definitions
- `controllers/` - Business logic for each route
- `middleware/` - Custom middleware (auth, validation, etc.)
- `config/` - Configuration files (database, etc.)
