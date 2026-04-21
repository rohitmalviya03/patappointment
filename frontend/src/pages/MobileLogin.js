import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { otpService } from '../services/api';
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
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Chip
} from '@mui/material';
import {
  PhoneAndroid,
  Sms,
  ArrowBack,
  Refresh
} from '@mui/icons-material';

const steps = ['Enter Phone', 'Verify OTP'];

export const MobileLogin = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [testOtp, setTestOtp] = useState('');
  const navigate = useNavigate();
  const { loginWithPhone } = useAuth();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await otpService.requestOTP(phone);
      setTestOtp(response.data.testOTP);
      setActiveStep(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await otpService.verifyOTP(phone, otp);
      loginWithPhone(response.data.token, response.data.phone);
      navigate('/service-options');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await otpService.resendOTP(phone);
      setTestOtp(response.data.testOTP);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setActiveStep(0);
    setOtp('');
    setError('');
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Box sx={{ width: '100%' }}>
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <PhoneAndroid sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Book Your Service
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Secure mobile verification for appointment booking
          </Typography>
        </Box>

        {/* Stepper */}
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Main Card */}
        <Card elevation={8} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {activeStep === 0 ? (
              // Phone Number Step
              <Box component="form" onSubmit={handleRequestOTP}>
                <Typography variant="h6" gutterBottom>
                  Enter your mobile number
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  We'll send a 6-digit OTP to verify your number
                </Typography>

                <TextField
                  fullWidth
                  label="10-digit Mobile Number"
                  variant="outlined"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  inputProps={{ maxLength: 10 }}
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: <Sms sx={{ color: 'action.active', mr: 1 }} />
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || phone.length !== 10}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem'
                  }}
                >
                  {loading ? 'Sending OTP...' : 'Get OTP'}
                </Button>
              </Box>
            ) : (
              // OTP Verification Step
              <Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <IconButton onClick={handleBack} sx={{ mr: 1 }}>
                    <ArrowBack />
                  </IconButton>
                  <Typography variant="h6">
                    Verify OTP
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Enter the 6-digit code sent to <strong>{phone}</strong>
                </Typography>

                {testOtp && (
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <strong>Test OTP:</strong> {testOtp}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="6-digit OTP"
                  variant="outlined"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  inputProps={{
                    maxLength: 6,
                    style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }
                  }}
                  sx={{ mb: 3 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    mb: 2
                  }}
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </Button>

                <Box textAlign="center">
                  <Button
                    startIcon={<Refresh />}
                    onClick={handleResendOTP}
                    disabled={loading}
                    sx={{ textTransform: 'none' }}
                  >
                    Resend OTP
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <Box textAlign="center" mt={3}>
          <Typography variant="body2" color="text.secondary">
            🔒 Secure • 📱 Mobile-first • ⚡ Fast
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};
