import React, { useState, useEffect } from 'react';
import { labService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const response = await labService.getAll();
      setLabs(response.data);
    } catch (err) {
      setError('Failed to load labs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><p>Loading labs...</p></div>;
  if (error) return <div className="container"><p style={{ color: 'red' }}>{error}</p></div>;

  return (
    <div className="container">
      <h2>Available Labs</h2>
      {!isAuthenticated && (
        <div className="card" style={{ backgroundColor: '#e7f5ff', borderLeft: '4px solid #3b82f6' }}>
          <p>Please <a href="/login">login</a> to book an appointment</p>
        </div>
      )}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {labs.map(lab => (
          <div key={lab._id} className="card">
            <h3>{lab.name}</h3>
            <p><strong>Email:</strong> {lab.email}</p>
            <p><strong>Phone:</strong> {lab.phone}</p>
            <p><strong>Address:</strong> {lab.address?.street}, {lab.address?.city}</p>
            <p><strong>Services:</strong> {lab.services?.join(', ')}</p>
            {isAuthenticated && (
              <button className="btn-primary">Book Appointment</button>
            )}
          </div>
        ))}
      </div>

      {labs.length === 0 && <p>No labs available</p>}
    </div>
  );
};
