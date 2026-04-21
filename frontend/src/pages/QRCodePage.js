import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

const QRCodePage = () => {
  const loginUrl = `${window.location.origin}/mobile-login`;

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Box sx={{ width: '100%' }}>
        {/* Header Section */}
        <Box textAlign="center" mb={4}>
          <QrCodeScannerIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Patient Appointment Booking
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Scan the QR code below to access the booking system
          </Typography>
        </Box>

        {/* QR Code Card */}
        <Card elevation={8} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center" mb={3}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  display: 'inline-block',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                <QRCodeCanvas
                  value={loginUrl}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                />
              </Paper>
            </Box>

            <Typography variant="body1" textAlign="center" color="text.secondary" mb={3}>
              Scan this QR code with your phone's camera to start booking your appointment
            </Typography>

            {/* Divider */}
            <Box sx={{ my: 3 }}>
              <Divider>
                <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                  OR
                </Typography>
              </Divider>
            </Box>

            {/* Alternative Access */}
            <Box textAlign="center">
              <Button
                component={Link}
                to="/mobile-login"
                variant="contained"
                size="large"
                startIcon={<PhoneAndroidIcon />}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
                  }
                }}
              >
                Continue to Mobile Login
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <Box textAlign="center" mt={4}>
          <Typography variant="body2" color="text.secondary">
            Secure • Fast • Easy Booking
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default QRCodePage;