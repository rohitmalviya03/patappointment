import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <h1>🏥 Appointment Booking</h1>
          <ul className="navbar-links">
            <li><Link to="/">Home</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link to="/appointments">My Appointments</Link></li>
                <li><span>{user?.name}</span></li>
                <li><button className="btn-danger" onClick={logout}>Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
