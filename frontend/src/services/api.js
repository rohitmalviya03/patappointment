import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Auth Service
export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => localStorage.removeItem("token"),
};

// OTP Service
export const otpService = {
  requestOTP: (phone) => api.post("/otp/request-otp", { phone }),
  verifyOTP: (phone, otp) => api.post("/otp/verify-otp", { phone, otp }),
  resendOTP: (phone) => api.post("/otp/resend-otp", { phone }),
};

// Lab Auth Service
export const labAuthService = {
  register: (data) => api.post("/lab-auth/register", data),
  login: (data) => api.post("/lab-auth/login", data),
  requestOTP: (phone) => api.post("/lab-auth/request-otp", { phone }),
  verifyOTP: (phone, otp) => api.post("/lab-auth/verify-otp", { phone, otp }),
};

// Lab Service
export const labService = {
  getAll: () => api.get("/labs"),
  getServices: () => api.get("/labs/services"),
  getById: (id) => api.get(`/labs/${id}`),
  create: (data) => api.post("/labs", data),
  update: (id, data) => api.put(`/labs/${id}`, data),
  delete: (id) => api.delete(`/labs/${id}`),
};

// Appointment Service (for registered users)
export const appointmentService = {
  getMyAppointments: () => api.get("/appointments"), // ✅ Fixed: was '/bookings'
  getAvailability: (date) => api.get(`/bookings/slots/${date}`),
  book: (data) => api.post("/appointments", data), // ✅ Fixed: was '/bookings'
  update: (id, data) => api.put(`/appointments/${id}`, data), // ✅ Fixed: was '/bookings'
  cancel: (id) => api.delete(`/appointments/${id}`), // ✅ Fixed: was '/bookings'
};

// Booking Service (for OTP/phone-based bookings)
export const bookingService = {
  createBooking: (data) => api.post("/bookings", data),
  getAllBookings: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/bookings/all${queryString ? `?${queryString}` : ""}`);
  },
  getBookingStats: () => api.get("/bookings/stats"),
  updateBookingStatus: (id, status) =>
    api.put(`/bookings/${id}/status`, { status }),
};

// Lab Dashboard Service
export const labDashboardService = {
  getAllAppointments: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/bookings/all${queryString ? `?${queryString}` : ""}`);
  },
  getAppointmentStats: () => api.get("/bookings/stats"),
  updateAppointmentStatus: (id, status) =>
    api.put(`/bookings/${id}/status`, { status }),
};

export default api;
