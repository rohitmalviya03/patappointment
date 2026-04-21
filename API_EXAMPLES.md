# API Examples & Testing

## Using Postman or cURL

### 1. User Registration

**Request:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 2. User Login

**Request:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

### 3. Create Lab (Admin Only)

**Request:**
```
POST http://localhost:5000/api/labs
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "City Diagnostic Center",
  "email": "contact@citydiag.com",
  "phone": "555-0123",
  "services": ["Blood Test", "X-Ray", "CT Scan", "COVID Test"],
  "description": "Full-service diagnostic lab in downtown area",
  "address": {
    "street": "123 Health Street",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "workingHours": {
    "monday": {"start": "09:00", "end": "18:00"},
    "tuesday": {"start": "09:00", "end": "18:00"},
    "wednesday": {"start": "09:00", "end": "18:00"},
    "thursday": {"start": "09:00", "end": "18:00"},
    "friday": {"start": "09:00", "end": "18:00"},
    "saturday": {"start": "10:00", "end": "14:00"},
    "sunday": {"start": "closed", "end": "closed"}
  },
  "appointmentDuration": 30,
  "maxAppointmentsPerSlot": 5
}
```

**Response:**
```json
{
  "message": "Lab created successfully",
  "lab": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "City Diagnostic Center",
    "email": "contact@citydiag.com",
    "phone": "555-0123",
    "services": ["Blood Test", "X-Ray", "CT Scan", "COVID Test"],
    "admin": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T10:35:00Z"
  }
}
```

### 4. Get All Labs

**Request:**
```
GET http://localhost:5000/api/labs
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "City Diagnostic Center",
    "email": "contact@citydiag.com",
    "phone": "555-0123",
    "address": {
      "street": "123 Health Street",
      "city": "New York",
      "state": "NY"
    },
    "services": ["Blood Test", "X-Ray", "CT Scan"],
    "workingHours": {...}
  }
]
```

### 5. Get Lab Details

**Request:**
```
GET http://localhost:5000/api/labs/507f1f77bcf86cd799439012
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "City Diagnostic Center",
  "email": "contact@citydiag.com",
  "phone": "555-0123",
  "address": {...},
  "services": ["Blood Test", "X-Ray", "CT Scan"],
  "workingHours": {...},
  "appointmentDuration": 30,
  "appointments": [...]
}
```

### 6. Book Appointment

**Request:**
```
POST http://localhost:5000/api/appointments
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "labId": "507f1f77bcf86cd799439012",
  "service": "Blood Test",
  "appointmentDate": "2024-01-20",
  "startTime": "10:00",
  "endTime": "10:30",
  "notes": "Fasting blood test"
}
```

**Response:**
```json
{
  "message": "Appointment booked successfully",
  "appointment": {
    "_id": "507f1f77bcf86cd799439013",
    "patient": "507f1f77bcf86cd799439011",
    "lab": "507f1f77bcf86cd799439012",
    "service": "Blood Test",
    "appointmentDate": "2024-01-20T00:00:00Z",
    "startTime": "10:00",
    "endTime": "10:30",
    "status": "scheduled",
    "createdAt": "2024-01-15T11:00:00Z"
  }
}
```

### 7. Get My Appointments

**Request:**
```
GET http://localhost:5000/api/appointments
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "patient": "507f1f77bcf86cd799439011",
    "lab": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "City Diagnostic Center"
    },
    "service": "Blood Test",
    "appointmentDate": "2024-01-20T00:00:00Z",
    "startTime": "10:00",
    "endTime": "10:30",
    "status": "scheduled"
  }
]
```

### 8. Cancel Appointment

**Request:**
```
DELETE http://localhost:5000/api/appointments/507f1f77bcf86cd799439013
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "message": "Appointment cancelled successfully"
}
```

### 9. Update Lab (Admin Only)

**Request:**
```
PUT http://localhost:5000/api/labs/507f1f77bcf86cd799439012
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "City Diagnostic Center - Updated",
  "phone": "555-0124",
  "services": ["Blood Test", "X-Ray", "CT Scan", "Ultrasound"]
}
```

**Response:**
```json
{
  "message": "Lab updated successfully",
  "lab": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "City Diagnostic Center - Updated",
    "phone": "555-0124",
    "services": ["Blood Test", "X-Ray", "CT Scan", "Ultrasound"]
  }
}
```

### 10. Health Check

**Request:**
```
GET http://localhost:5000/api/health
```

**Response:**
```json
{
  "status": "API is running"
}
```

## cURL Examples

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "patient"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get All Labs
```bash
curl http://localhost:5000/api/labs
```

### Get Appointments (requires token)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:5000/api/appointments
```

## Error Responses

### Validation Error
```json
{
  "message": "Validation error",
  "errors": ["Email is required", "Password must be at least 6 characters"]
}
```

### Authentication Error
```json
{
  "message": "Invalid or expired token"
}
```

### Authorization Error
```json
{
  "message": "Admin access required"
}
```

### Not Found Error
```json
{
  "message": "Lab not found"
}
```

### Internal Server Error
```json
{
  "message": "Internal server error"
}
```

## Testing Tips

1. **Save Token**: After login, save the token and use it for authenticated requests
2. **Use Postman Environment**: Create variables for `baseUrl` and `token`
3. **Test Flows**: Test complete user journeys (register → browse → book → cancel)
4. **Error Cases**: Test with invalid data to verify error handling
5. **Edge Cases**: Test with missing fields, duplicate emails, etc.

## Important Notes

- All timestamps are in ISO 8601 format
- Token expires after 7 days
- Passwords are hashed and never returned in responses
- Admin-only endpoints require Authorization header with valid token
- All requests should include `Content-Type: application/json` header
