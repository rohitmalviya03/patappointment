import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppointments();
    }
  }, [isAuthenticated]);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentService.getMyAppointments();
      setAppointments(response.data);
    } catch (err) {
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.cancel(id);
        setAppointments(appointments.filter(apt => apt._id !== id));
      } catch (err) {
        setError('Failed to cancel appointment');
      }
    }
  };

  if (!isAuthenticated) {
    return <div className="container"><p>Please login to view your appointments</p></div>;
  }

  if (loading) return <div className="container"><p>Loading appointments...</p></div>;
  if (error) return <div className="container"><p style={{ color: 'red' }}>{error}</p></div>;

  return (
    <div className="container">
      <h2>My Appointments</h2>
      {appointments.length === 0 ? (
        <div className="card">
          <p>You have no appointments yet. <a href="/">Book one now!</a></p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {appointments.map(apt => (
            <div key={apt._id} className="card">
              <h3>{apt.lab?.name}</h3>
              <p><strong>Service:</strong> {apt.service}</p>
              <p><strong>Patient:</strong> {apt.patientName}</p>
              <p><strong>Address:</strong> {apt.patientAddress}</p>
              <p><strong>Date:</strong> {new Date(apt.appointmentDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {apt.startTime} - {apt.endTime}</p>
              <p><strong>Status:</strong> <span style={{
                padding: '5px 10px',
                borderRadius: '4px',
                backgroundColor: apt.status === 'cancelled' ? '#fee2e2' : '#dbeafe'
              }}>{apt.status}</span></p>
              {apt.status === 'confirmed' && (
                <button className="btn-danger" onClick={() => cancelAppointment(apt._id)}>
                  Cancel Appointment
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
