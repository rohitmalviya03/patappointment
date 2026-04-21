require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const labAuthRoutes = require('./routes/labAuth');
const labRoutes = require('./routes/labs');
const appointmentRoutes = require('./routes/appointments');
const otpRoutes = require('./routes/otp');
const bookingRoutes = require('./routes/bookings');
const callbackRoutes = require('./routes/callbacks');
const sampleRoutes = require('./routes/samples');

const app = express();

// Disable ETag so API responses do not return 304 for conditional requests.
app.set('etag', false);

// Connect to MySQL
connectDB();

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.options('*', cors());
app.use(express.json());

// Prevent browser/proxy caching for API responses.
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/lab-auth', labAuthRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/callbacks', callbackRoutes);
app.use('/api/samples', sampleRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 API Endpoints:`);
  console.log(`   - OTP: /api/otp (request-otp, verify-otp, resend-otp)`);
  console.log(`   - Bookings: /api/bookings`);
  console.log(`   - Callbacks: /api/callbacks`);
  console.log(`   - Samples: /api/samples`);
  console.log(`   - Labs: /api/labs`);
  console.log(`   - Appointments: /api/appointments`);
});
