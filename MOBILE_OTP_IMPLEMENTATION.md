# Mobile OTP Authentication & 3-Service Options - Complete Implementation

## ✅ Implementation Complete!

Your appointment booking system now supports mobile number-based OTP authentication with 3 service options.

## 🚀 Current Status

### ✓ Backend (Running on http://localhost:5000)
- OTP generation and verification
- Session token management (12-hour validity)
- 3 service options: Bookings, Callbacks, Sample Collection
- All models and routes implemented

### ✓ Frontend (Running on http://localhost:3000)
- Mobile OTP login page
- Service options selection page
- 3 complete service forms
- Context-based authentication

### ⚠️ MongoDB
MongoDB is not connected (waiting for your setup). See below for setup options.

## 📱 User Journey

```
1. Visit /mobile-login
   ↓
2. Enter 10-digit mobile number
   ↓
3. Receive OTP (test OTP shown on screen)
   ↓
4. Verify OTP
   ↓
5. Choose from 3 options:
   a) Book Appointment 📋
   b) Request Callback 📞
   c) Sample Collection at Home 🏠
```

## 🎯 Testing the System

### Quick Test (No MongoDB Needed)
1. Open browser: http://localhost:3000
2. Redirect to mobile login: http://localhost:3000/mobile-login
3. Enter any 10-digit number: `1234567890`
4. Click "Get OTP"
5. Use the displayed test OTP
6. Verify OTP → Success!
7. See 3 service options

### Test Each Service

#### A. Book Appointment
1. Click "Book Now"
2. Select a lab (API will need labs data)
3. Choose service
4. Select date & time
5. Confirm booking

#### B. Request Callback
1. Click "Request Callback"
2. Fill form details
3. Choose preferred time
4. Submit request

#### C. Sample Collection
1. Click "Request Collection"
2. Enter address details
3. Select sample type
4. Choose date & time
5. Submit request

## 🧪 API Testing with cURL

### 1. Request OTP
```bash
curl -X POST http://localhost:5000/api/otp/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"1234567890"}'
```

Response:
```json
{
  "message": "OTP sent successfully",
  "phone": "1234567890",
  "testOTP": "123456"
}
```

### 2. Verify OTP
```bash
curl -X POST http://localhost:5000/api/otp/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"1234567890","otp":"123456"}'
```

Response:
```json
{
  "message": "OTP verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "phone": "1234567890"
}
```

### 3. Book Appointment
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "labId": "lab_id",
    "service": "Blood Test",
    "appointmentDate": "2024-01-20",
    "startTime": "10:00",
    "endTime": "10:30",
    "patientName": "John Doe",
    "notes": "Fasting required"
  }'
```

### 4. Get Booking Slots
```bash
curl http://localhost:5000/api/bookings/slots/LAB_ID/2024-01-20
```

### 5. Request Callback
```bash
curl -X POST http://localhost:5000/api/callbacks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "patientName": "John Doe",
    "email": "john@example.com",
    "service": "Blood Test",
    "preferredDate": "2024-01-20",
    "preferredTime": "morning",
    "description": "Need consultation"
  }'
```

### 6. Request Sample Collection
```bash
curl -X POST http://localhost:5000/api/samples \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "patientName": "John Doe",
    "email": "john@example.com",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    },
    "sampleType": "blood",
    "preferredDate": "2024-01-20",
    "preferredTime": "morning",
    "testName": "COVID Test"
  }'
```

## 🔧 Setup MongoDB (Required for Production)

### Option 1: Docker (Recommended)
```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Option 2: Local Installation
1. Download: https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. MongoDB will run on localhost:27017

### Option 3: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string
4. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/appointment-system
   ```

## 📂 New Files Created

### Backend
- `models/OTP.js` - OTP storage model
- `models/AppointmentBooking.js` - Booking requests
- `models/CallbackRequest.js` - Callback requests
- `models/SampleCollection.js` - Sample collection requests
- `config/otpService.js` - OTP utilities
- `routes/otp.js` - OTP endpoints
- `routes/bookings.js` - Booking endpoints
- `routes/callbacks.js` - Callback endpoints
- `routes/samples.js` - Sample collection endpoints

### Frontend
- `pages/MobileLogin.js` - OTP login page
- `pages/ServiceOptions.js` - Service selection
- `pages/BookAppointment.js` - Appointment booking form
- `pages/RequestCallback.js` - Callback request form
- `pages/SampleCollection.js` - Sample collection form

### Updated Files
- `backend/server.js` - Added new routes
- `frontend/src/App.js` - Added new routes
- `frontend/src/context/AuthContext.js` - Mobile auth support

## 🔐 OTP Security Features

✓ 6-digit OTP  
✓ 5-minute expiration  
✓ Max 5 attempts  
✓ Auto-delete expired OTP  
✓ Unique per phone number  
✓ 12-hour session token  
✓ Phone number validation (10 digits)  

## 📊 Data Models

### OTP
- Phone (unique, indexed)
- OTP (6 digits)
- Attempts
- Expiration time
- Verification status

### AppointmentBooking
- Phone (indexed)
- Lab reference
- Service name
- Appointment date/time
- Patient name
- Status (pending/confirmed/completed/cancelled)

### CallbackRequest
- Phone (indexed)
- Service required
- Preferred date/time
- Email & name
- Status (pending/accepted/scheduled/completed/cancelled)

### SampleCollection
- Phone (indexed)
- Complete address
- Sample type
- Preferred date/time
- Test name
- Status (pending/scheduled/completed/cancelled)

## 🚀 Next Steps

### Immediate Tasks
1. **Start MongoDB** - Essential for data persistence
2. **Test OTP Flow** - Verify OTP sending/verification
3. **Test Services** - Test each of the 3 options
4. **Create Labs** - Add lab data via API

### Production Checklist
- [ ] Install SMS service (Twilio, AWS SNS)
- [ ] Configure email notifications
- [ ] Setup database backups
- [ ] Add rate limiting
- [ ] Configure CORS for production
- [ ] Add payment integration
- [ ] Setup monitoring/logging
- [ ] Create admin dashboard

### Enhancement Ideas
- WhatsApp OTP delivery
- Push notifications
- Email confirmations
- Payment processing
- Lab performance analytics
- Customer feedback system
- Multi-language support
- Mobile app (React Native)

## 📞 Key Endpoints Summary

```
POST   /api/otp/request-otp       → Send OTP to phone
POST   /api/otp/verify-otp        → Verify OTP & get token
POST   /api/otp/resend-otp        → Resend OTP

GET    /api/bookings/slots/:id/:date → Get available slots
POST   /api/bookings              → Create booking
GET    /api/bookings              → Get user bookings
DELETE /api/bookings/:id          → Cancel booking

POST   /api/callbacks             → Request callback
GET    /api/callbacks             → Get requests
DELETE /api/callbacks/:id         → Cancel request

POST   /api/samples               → Request sample collection
GET    /api/samples               → Get requests
DELETE /api/samples/:id           → Cancel request
```

## 💡 Example: Complete User Flow

```
1. User enters: 9876543210
2. System sends OTP
3. User sees test OTP: 654321
4. User enters OTP
5. System generates token
6. Redirects to /service-options
7. User sees 3 options with icons
8. Selects: Book Appointment
9. Navigates to /book-appointment
10. Form shows available labs
11. Selects lab, service, date, time
12. Confirms details
13. Appointment created in database
14. Shows confirmation number
15. Returns to service options
```

## ⚡ Quick Start Checklist

- [x] OTP authentication implemented
- [x] 3 service options created
- [x] Frontend pages built
- [x] API routes configured
- [x] Database models defined
- [x] Context API updated
- [ ] MongoDB running (you need to do this)
- [ ] SMS service integrated (optional for production)
- [ ] Test data created (optional)

---

**The system is ready to use!** Just start MongoDB and begin testing. 🎉

For detailed API documentation, see `OTP_FEATURE.md`
For getting started guide, see `GETTING_STARTED.md`
