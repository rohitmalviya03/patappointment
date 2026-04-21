import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  IconButton,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  EventAvailable,
  PhoneCallback,
  Home,
  Logout,
  CalendarToday,
  Call,
  MedicalServices
} from '@mui/icons-material';

const services = [
  {
    id: 'appointment',
    title: 'Book Appointment',
    description: 'Schedule a lab appointment at your convenient time and date',
    icon: <EventAvailable sx={{ fontSize: 48 }} />,
    color: '#2196F3',
    path: '/book-appointment',
    buttonText: 'Book Now'
  },
  {
    id: 'callback',
    title: 'Request Callback',
    description: 'Let our team contact you to discuss your requirements',
    icon: <PhoneCallback sx={{ fontSize: 48 }} />,
    color: '#4CAF50',
    path: '/request-callback',
    buttonText: 'Request Callback'
  },
  {
    id: 'sample',
    title: 'Home Sample Collection',
    description: 'Get home sample collection service at your doorstep',
    icon: <Home sx={{ fontSize: 48 }} />,
    color: '#FF9800',
    path: '/sample-collection',
    buttonText: 'Request Collection'
  }
];

export const ServiceOptions = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, phone } = useAuth();

  if (!isAuthenticated) {
    navigate('/mobile-login');
    return null;
  }

  const handleServiceClick = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar position="static" elevation={2} sx={{ backgroundColor: 'white', color: 'black' }}>
        <Toolbar>
          <MedicalServices sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Lab Services
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {phone}
          </Typography>
          <IconButton
            color="inherit"
            onClick={logout}
            sx={{ ml: 2 }}
            title="Logout"
          >
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Welcome Section */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Welcome to Our Lab Services
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            What would you like to do today?
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Choose from our convenient service options below
          </Typography>
        </Box>

        {/* Services Grid */}
        <Grid container spacing={4} justifyContent="center">
          {services.map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              <Card
                elevation={4}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  borderRadius: 3,
                  border: `2px solid ${service.color}20`,
                  '&:hover': {
                    elevation: 8,
                    transform: 'translateY(-8px)',
                    borderColor: service.color,
                    boxShadow: `0 12px 24px rgba(0,0,0,0.15)`
                  }
                }}
                onClick={() => handleServiceClick(service.path)}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                  <Box
                    sx={{
                      color: service.color,
                      mb: 3,
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    {service.icon}
                  </Box>
                  <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                    {service.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {service.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleServiceClick(service.path);
                    }}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      backgroundColor: service.color,
                      '&:hover': {
                        backgroundColor: service.color,
                        opacity: 0.9
                      }
                    }}
                  >
                    {service.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Footer */}
        <Box textAlign="center" mt={6}>
          <Typography variant="body2" color="text.secondary">
            🔒 Secure • 📱 Mobile-first • ⚡ Fast • 🏥 Trusted
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
