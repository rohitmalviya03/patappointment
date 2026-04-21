import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { labService, bookingService, appointmentService } from "../services/api";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Alert,
  Stepper,
  Step,
  StepLabel,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Schedule,
  CheckCircle,
  ArrowBack,
  ArrowForward,
  MedicalServices,
} from "@mui/icons-material";

const steps = ["Select Service", "Choose Date & Time", "Confirm Details"];

export const BookAppointment = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [patientAddress, setPatientAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate("/mobile-login");
      return;
    }
    fetchServices();
  }, [token, navigate]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const servicesResponse = await labService.getServices();
      setServices(servicesResponse.data);
    } catch (err) {
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!appointmentDate) return;

    try {
      setLoading(true);
      const response =
        await appointmentService.getAvailability(appointmentDate);
      setAvailableSlots(response.data.slots || []);
    } catch (err) {
      setError("Failed to load available slots. Please try again.");
      // Fallback to mock data if API fails
      const slots = generateTimeSlots();
      setAvailableSlots(slots);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    const duration = 30; // 30 minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += duration) {
        const startTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const endTime = `${(hour + Math.floor((minute + duration) / 60)).toString().padStart(2, "0")}:${((minute + duration) % 60).toString().padStart(2, "0")}`;

        slots.push({
          startTime,
          endTime,
          available: Math.random() > 0.3, // Mock availability
        });
      }
    }
    return slots;
  };

  useEffect(() => {
    if (appointmentDate && activeStep === 1) {
      fetchAvailableSlots();
    }
  }, [appointmentDate, activeStep]);

  const handleNext = () => {
    if (activeStep === 0 && !selectedService) {
      setError("Please select a service");
      return;
    }
    if (activeStep === 1 && (!appointmentDate || !selectedSlot)) {
      setError("Please select a date and time slot");
      return;
    }
    setError("");
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError("");
  };

  const handleBookAppointment = async () => {
    if (!patientName.trim() || !patientAddress.trim()) {
      setError("Please enter your name and address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const bookingData = {
        service: selectedService,
        appointmentDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        patientName: patientName.trim(),
        patientAddress: patientAddress.trim(),
      };

      const response = await bookingService.createBooking(bookingData);

      setBookingDetails(response.data);
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to book appointment. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
    navigate("/service-options");
  };

  if (loading && services.length === 0) {
    return (
      <Container
        maxWidth="md"
        sx={{ display: "flex", justifyContent: "center", mt: 4 }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          fontWeight="bold"
        >
          📋 Book Appointment
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Step 1: Select Service */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select a Service
            </Typography>

            <Grid container spacing={2}>
              {services.map((service) => (
                <Grid item xs={12} sm={6} md={4} key={service}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      border: selectedService === service ? 2 : 1,
                      borderColor:
                        selectedService === service
                          ? "primary.main"
                          : "grey.300",
                      bgcolor:
                        selectedService === service ? "primary.light" : "white",
                    }}
                    onClick={() => {
                      setSelectedService(service);
                      setError("");
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center">
                        <MedicalServices color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" component="h2">
                          {service}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Step 2: Choose Date & Time */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Choose Date & Time
            </Typography>

            <>
              <TextField
                fullWidth
                label="Appointment Date"
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getMinDate() }}
                sx={{ mb: 3 }}
              />

              {appointmentDate && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Available Time Slots
                  </Typography>
                  <Grid container spacing={1}>
                    {availableSlots
                      .filter((slot) => slot.available)
                      .map((slot, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                          <Button
                            fullWidth
                            variant={selectedSlot === slot ? "contained" : "outlined"}
                            onClick={() => setSelectedSlot(slot)}
                            sx={{ py: 1 }}
                          >
                            <Schedule fontSize="small" sx={{ mr: 0.5 }} />
                            {slot.startTime}
                          </Button>
                        </Grid>
                      ))}
                  </Grid>
                  {availableSlots.filter((slot) => slot.available).length === 0 && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 2 }}
                    >
                      No slots available for this date. Please select a different date.
                    </Typography>
                  )}
                </Box>
              )}
            </>
          </Box>
        )}

        {/* Step 3: Confirm Details */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirm Your Appointment
            </Typography>

            <Card sx={{ mb: 3, bgcolor: "grey.50" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Appointment Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Service:</strong> {selectedService}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Date:</strong>{" "}
                      {new Date(appointmentDate).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      <strong>Time:</strong> {selectedSlot?.startTime} -{" "}
                      {selectedSlot?.endTime}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <TextField
              fullWidth
              label="Your Name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              sx={{ mb: 2 }}
              required
            />

            <TextField
              fullWidth
              label="Your Address"
              value={patientAddress}
              onChange={(e) => setPatientAddress(e.target.value)}
              multiline
              rows={2}
              placeholder="Enter your complete address"
              required
            />
          </Box>
        )}

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBack />}
          >
            Back
          </Button>

          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleBookAppointment}
                disabled={
                  loading || !patientName.trim() || !patientAddress.trim()
                }
                startIcon={
                  loading ? <CircularProgress size={20} /> : <CheckCircle />
                }
              >
                {loading ? "Booking..." : "Confirm & Book"}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForward />}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Success Dialog */}
      <Dialog
        open={success}
        onClose={handleCloseSuccess}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          <CheckCircle color="success" sx={{ fontSize: 48, mb: 1 }} />
          Appointment Booked Successfully!
        </DialogTitle>
        <DialogContent>
          {bookingDetails && (
            <Box>
              <Typography gutterBottom>
                <strong>Confirmation Number:</strong>{" "}
                {bookingDetails.confirmationNumber}
              </Typography>
              <Typography gutterBottom>
                <strong>Date:</strong>{" "}
                {new Date(
                  bookingDetails.booking?.appointmentDate,
                ).toLocaleDateString()}
              </Typography>
              <Typography gutterBottom>
                <strong>Time:</strong> {bookingDetails.booking?.startTime} -{" "}
                {bookingDetails.booking?.endTime}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                You will receive a confirmation SMS with the details.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccess} variant="contained" fullWidth>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookAppointment;
