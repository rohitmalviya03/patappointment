# OTP-Based Mobile Appointment Booking System

## 🎯 New Features

The system now supports mobile number-based OTP authentication with 3 service options:

1. **Book Appointment** - Schedule a lab appointment
2. **Request Callback** - Request a callback from the lab
3. **Sample Collection at Home** - Get home sample collection service

## 📱 How It Works

### Step 1: Mobile Login with OTP
1. Patient enters 10-digit mobile number
2. System sends OTP via SMS (simulated in dev mode)
3. Patient enters OTP to verify
4. Session token generated for 12 hours

### Step 2: Choose Service  
After OTP verification, patient sees 3 options:
- 📋 Book Appointment
- 📞 Request Callback
- 🏠 Sample Collection at Home

### Step 3: Complete Service Request
Each option has its own form and workflow

## 🔧 Backend Implementation

### New Models
- **OTP** - Stores OTP with expiration
- **AppointmentBooking** - Booking requests (phone-based)
- **CallbackRequest** - Callback service requests
- **SampleCollection** - Home sample collection requests

### New Routes

#### OTP Routes (`/api/otp`)
```
POST /api/otp/request-otp
- Body: { phone: "1234567890" }
- Response: { message, phone, testOTP }

POST /api/otp/verify-otp
- Body: { phone: "1234567890", otp: "123456" }
- Response: { message, token, phone }

POST /api/otp/resend-otp
- Body: { phone: "1234567890" }
- Response: { message, phone, testOTP }
```

#### Booking Routes (`/api/bookings`)
```
GET /api/bookings/slots/:labId/:date
- Response: { labId, date, slots[] }

POST /api/bookings
- Headers: Authorization: Bearer {token}
- Body: { labId, service, appointmentDate, startTime, endTime, patientName, notes }
- Response: { message, booking, confirmationNumber }

GET /api/bookings
- Headers: Authorization: Bearer {token}
- Response: [booking1, booking2, ...]

DELETE /api/bookings/:id
- Headers: Authorization: Bearer {token}
- Response: { message }
```

#### Callback Routes (`/api/callbacks`)
```
POST /api/callbacks
- Headers: Authorization: Bearer {token}
- Body: { patientName, email, service, preferredDate, preferredTime, description }
- Response: { message, callbackRequest, requestId }

GET /api/callbacks
- Headers: Authorization: Bearer {token}
- Response: [request1, request2, ...]

DELETE /api/callbacks/:id
- Headers: Authorization: Bearer {token}
- Response: { message }
```

#### Sample Collection Routes (`/api/samples`)
```
POST /api/samples
- Headers: Authorization: Bearer {token}
- Body: { patientName, email, address, sampleType, preferredDate, preferredTime, testName, notes }
- Response: { message, sampleCollection, requestId }

GET /api/samples
- Headers: Authorization: Bearer {token}
- Response: [sample1, sample2, ...]

DELETE /api/samples/:id
- Headers: Authorization: Bearer {token}
- Response: { message }
```

## 🎨 Frontend Implementation

### New Pages
1. **MobileLogin** - OTP verification page
2. **ServiceOptions** - Choose service option
3. **BookAppointment** - Multi-step appointment booking
4. **RequestCallback** - Callback request form
5. **SampleCollection** - Home sample collection form

### Updated Context
- **AuthContext** - Now supports mobile authentication
  - `loginWithPhone()` - Mobile-based login
  - `authType` - Track if using 'email' or 'mobile'

### Routes
```
/mobile-login - Mobile OTP login
/service-options - Choose service
/book-appointment - Book appointment
/request-callback - Request callback
/sample-collection - Home sample collection
```

## 📊 User Flow

```
Mobile Login (OTP)
    ↓
OTP Verification
    ↓
Service Options Page
    ├─→ Book Appointment → Select Lab → Select Date/Time → Confirm
    ├─→ Request Callback → Fill Form → Submit
    └─→ Sample Collection → Fill Address → Select Time → Submit
```

## 🧪 Testing

### Test OTP (Development)
1. Go to `/mobile-login`
2. Enter any 10-digit number: `1234567890`
3. Click "Get OTP"
4. Use the test OTP displayed on screen
5. Click "Verify OTP"

### API Testing with Postman

#### Request OTP
```
POST http://localhost:5000/api/otp/request-otp
Content-Type: application/json

{
  "phone": "1234567890"
}
```

#### Verify OTP
```
POST http://localhost:5000/api/otp/verify-otp
Content-Type: application/json

{
  "phone": "1234567890",
  "otp": "123456"
}
```

#### Book Appointment
```
POST http://localhost:5000/api/bookings
Authorization: Bearer {token_from_verify_otp}
Content-Type: application/json

{
  "labId": "lab_id_here",
  "service": "Blood Test",
  "appointmentDate": "2024-01-20",
  "startTime": "10:00",
  "endTime": "10:30",
  "patientName": "John Doe",
  "notes": "Fasting required"
}
```

## 🔐 Security Features

1. **OTP Validation**
   - 6-digit OTP
   - Expires in 5 minutes
   - Max 5 attempts before expiry
   - Unique per phone number

2. **Session Token**
   - JWT token valid for 12 hours
   - Includes phone number verification status
   - Required for all service requests

3. **Phone-Based Authorization**
   - All requests tied to verified phone number
   - Patients can only access their own requests
   - Phone number validated (10 digits)

## 📝 Production Checklist

- [ ] Integrate SMS service (Twilio, AWS SNS, etc.) instead of console logging
- [ ] Update OTP template and branding
- [ ] Add rate limiting to prevent abuse
- [ ] Implement email notifications (booking confirmation, callbacks, etc.)
- [ ] Add payment integration for premium services
- [ ] Setup monitoring and analytics
- [ ] Implement audit logs
- [ ] Add request tracking dashboard

## 🚀 Future Enhancements

1. **WhatsApp Integration** - Receive OTP via WhatsApp
2. **Push Notifications** - Real-time updates about appointments
3. **Rating & Reviews** - Customer feedback system
4. **Analytics Dashboard** - Admin stats for bookings, callbacks, samples
5. **Payment Processing** - Online payment for services
6. **Subscription Plans** - Packages for regular customers
7. **Lab Performance Metrics** - Track response times, success rates
8. **Multi-Language Support** - Regional language support

---

The system is now ready for mobile-first appointment booking with OTP-based authentication!
