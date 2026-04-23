import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Appointments } from './pages/Appointments';
import { MobileLogin } from './pages/MobileLogin';
import { ServiceOptions } from './pages/ServiceOptions';
import { BookAppointment } from './pages/BookAppointment';
import { RequestCallback } from './pages/RequestCallback';
import { SampleCollection } from './pages/SampleCollection';
import LabLogin from './pages/LabLogin';
import LabDashboard from './pages/LabDashboard';
import QRCodePage from './pages/QRCodePage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
};
//////////////
const MobileProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, authType } = useAuth();

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  if (!isAuthenticated || authType !== 'mobile') return <Navigate to="/mobile-login" />;
  return children;
};

const LabProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, authType } = useAuth();

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  if (!isAuthenticated || authType !== 'lab') return <Navigate to="/lab-login" />;
  return children;
};

 function AppContent() {
  const { authType } = useAuth();

  return (
    <Router>
      {authType === 'mobile' ? null : <Navbar />}
      <Routes>
        {/* QR Code access */}
        <Route path="/" element={<QRCodePage />} />

        {/* Old email-based routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />

        {/* New mobile-based routes */}
        <Route path="/mobile-login" element={<MobileLogin />} />
        <Route
          path="/service-options"
          element={
            <MobileProtectedRoute>
              <ServiceOptions />
            </MobileProtectedRoute>
          }
        />
        <Route
          path="/book-appointment"
          element={
            <MobileProtectedRoute>
              <BookAppointment />
            </MobileProtectedRoute>
          }
        />
        <Route
          path="/request-callback"
          element={
            <MobileProtectedRoute>
              <RequestCallback />
            </MobileProtectedRoute>
          }
        />
        <Route
          path="/sample-collection"
          element={
            <MobileProtectedRoute>
              <SampleCollection />
            </MobileProtectedRoute>
          }
        />

        {/* Lab routes */}
        <Route path="/lab-login" element={<LabLogin />} />
        <Route
          path="/lab-dashboard"
          element={
            <LabProtectedRoute>
              <LabDashboard />
            </LabProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
