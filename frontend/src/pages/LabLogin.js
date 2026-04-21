import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { labAuthService, labService } from "../services/api";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Card,
  CardContent,
  Tab,
  Tabs,
  Stepper,
  Step,
  StepLabel,
  Autocomplete,
  Chip,
} from "@mui/material";
import {
  Business,
  PhoneAndroid,
  Sms,
  Login,
  Person,
  Lock,
} from "@mui/icons-material";

const LabLogin = () => {
  const [loginMethod, setLoginMethod] = useState(0); // 0: username/password, 1: phone/OTP, 2: register
  const [step, setStep] = useState(0); // For OTP flow
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    otp: "",
    labCode: "",
    services: [],
  });
  const [serviceOptions, setServiceOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [testOtp, setTestOtp] = useState("");
  const { loginLab } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTabChange = (event, newValue) => {
    setLoginMethod(newValue);
    setStep(0);
    setError("");
    setTestOtp("");
    setFormData({
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      phone: "",
      otp: "",
      labCode: "",
      services: [],
    });
  };

  const handleUsernamePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await labAuthService.login({
        identifier: formData.username,
        password: formData.password,
      });
      loginLab(response.data.token, response.data.lab);
      navigate("/lab-dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await labAuthService.requestOTP(formData.phone);
      setTestOtp(response.data.testOTP);
      setStep(1);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await labAuthService.verifyOTP(
        formData.phone,
        formData.otp,
      );
      loginLab(response.data.token, response.data.lab);
      navigate("/lab-dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loginMethod !== 2) return;

    const loadServiceOptions = async () => {
      try {
        const response = await labService.getServices();
        setServiceOptions(response.data || []);
      } catch (error) {
        console.error("Failed to load service options", error);
      }
    };

    loadServiceOptions();
  }, [loginMethod]);

  const handleRegisterLab = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const normalizedServices = formData.services
      .map((service) => String(service).trim())
      .filter(Boolean);

    if (normalizedServices.length === 0) {
      setError("Please add at least one service offered");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords must match");
      setLoading(false);
      return;
    }

    try {
      const response = await labAuthService.register({
        name: formData.name,
        username: formData.username,
        password: formData.password,
        email: formData.email,
        phone: formData.phone,
        labCode: formData.labCode,
        services: normalizedServices,
      });
      loginLab(response.data.token, response.data.lab);
      navigate("/lab-dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(0);
    setFormData({ ...formData, otp: "" });
    setError("");
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: "100vh", display: "flex", alignItems: "center", py: 4 }}
    >
      <Box sx={{ width: "100%" }}>
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Business sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Lab Portal
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Access your lab management dashboard
          </Typography>
        </Box>

        {/* Login Method Tabs */}
        <Paper elevation={3} sx={{ mb: 3 }}>
          <Tabs
            value={loginMethod}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab
              icon={<Person />}
              label="Username Login"
              iconPosition="start"
              sx={{ textTransform: "none" }}
            />
            <Tab
              icon={<PhoneAndroid />}
              label="Phone Login"
              iconPosition="start"
              sx={{ textTransform: "none" }}
            />
            <Tab
              icon={<Login />}
              label="Register Lab"
              iconPosition="start"
              sx={{ textTransform: "none" }}
            />
          </Tabs>
        </Paper>

        {/* Main Card */}
        <Card elevation={8} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {loginMethod === 0 ? (
              // Username/Password Login
              <Box component="form" onSubmit={handleUsernamePasswordLogin}>
                <Typography variant="h6" gutterBottom>
                  Login with Username & Password
                </Typography>

                <TextField
                  fullWidth
                  label="Lab Code or Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <Person sx={{ color: "action.active", mr: 1 }} />
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <Lock sx={{ color: "action.active", mr: 1 }} />
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                  }}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </Box>
            ) : loginMethod === 1 ? (
              // Phone/OTP Login
              <Box>
                <Typography variant="h6" gutterBottom>
                  Login with Phone & OTP
                </Typography>

                {step === 0 ? (
                  // Phone Input Step
                  <Box component="form" onSubmit={handleRequestOTP}>
                    <TextField
                      fullWidth
                      label="10-digit Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                        })
                      }
                      inputProps={{ maxLength: 10 }}
                      required
                      sx={{ mb: 3 }}
                      InputProps={{
                        startAdornment: (
                          <Sms sx={{ color: "action.active", mr: 1 }} />
                        ),
                      }}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading || formData.phone.length !== 10}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: "1.1rem",
                      }}
                    >
                      {loading ? "Sending OTP..." : "Send OTP"}
                    </Button>
                  </Box>
                ) : (
                  // OTP Verification Step
                  <Box>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Button onClick={handleBack} sx={{ mr: 1 }}>
                        Back
                      </Button>
                      <Typography variant="h6">Verify OTP</Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      Enter the 6-digit code sent to{" "}
                      <strong>{formData.phone}</strong>
                    </Typography>

                    {testOtp && (
                      <Alert severity="info" sx={{ mb: 3 }}>
                        <strong>Test OTP:</strong> {testOtp}
                      </Alert>
                    )}

                    <TextField
                      fullWidth
                      label="6-digit OTP"
                      name="otp"
                      value={formData.otp}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          otp: e.target.value.replace(/\D/g, "").slice(0, 6),
                        })
                      }
                      inputProps={{
                        maxLength: 6,
                        style: {
                          textAlign: "center",
                          fontSize: "1.5rem",
                          letterSpacing: "0.5rem",
                        },
                      }}
                      sx={{ mb: 3 }}
                    />

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleVerifyOTP}
                      disabled={loading || formData.otp.length !== 6}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: "1.1rem",
                        mb: 2,
                      }}
                    >
                      {loading ? "Verifying..." : "Verify & Login"}
                    </Button>
                  </Box>
                )}
              </Box>
            ) : (
              // Register Lab
              <Box component="form" onSubmit={handleRegisterLab}>
                <Typography variant="h6" gutterBottom>
                  Register a New Lab
                </Typography>

                <TextField
                  fullWidth
                  label="Lab Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                    })
                  }
                  inputProps={{ maxLength: 10 }}
                  required
                  sx={{ mb: 2 }}
                />

                <Autocomplete
                  multiple
                  freeSolo
                  options={serviceOptions}
                  value={formData.services}
                  onChange={(event, newValue) => {
                    setFormData({ ...formData, services: newValue });
                    if (error === "Please add at least one service offered") {
                      setError("");
                    }
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Services offered"
                      placeholder="Add or select services"
                      error={
                        error === "Please add at least one service offered"
                      }
                      helperText={
                        error === "Please add at least one service offered"
                          ? error
                          : ""
                      }
                      sx={{ mb: 2 }}
                    />
                  )}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Lab Code (optional)"
                  name="labCode"
                  value={formData.labCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      labCode: e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, ""),
                    })
                  }
                  helperText="Optional custom code, e.g. CITYLAB123"
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                  }}
                >
                  {loading ? "Registering..." : "Register Lab"}
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <Box textAlign="center" mt={3}>
          <Link to="/mobile-login" style={{ textDecoration: "none" }}>
            <Button variant="text" sx={{ textTransform: "none" }}>
              Patient Login
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default LabLogin;
