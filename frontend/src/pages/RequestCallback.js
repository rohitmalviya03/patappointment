import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RequestCallback = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    email: '',
    service: '',
    preferredDate: '',
    preferredTime: 'morning',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/callbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
      } else {
        alert('Callback request submitted successfully! Our team will contact you soon.');
        navigate('/service-options');
      }
    } catch (err) {
      setError('Failed to submit callback request');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>📞 Request Callback</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Let our team contact you to discuss your requirements
        </p>

        {error && (
          <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#fee2e2', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <label>
              <strong>Your Name:</strong>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </label>

            <label>
              <strong>Email Address:</strong>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </label>

            <label>
              <strong>Service Required:</strong>
              <input
                type="text"
                name="service"
                value={formData.service}
                onChange={handleChange}
                placeholder="e.g., Blood Test, COVID Test"
                required
              />
            </label>

            <label>
              <strong>Preferred Date:</strong>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                min={getMinDate()}
                required
              />
            </label>

            <label>
              <strong>Preferred Time:</strong>
              <select name="preferredTime" value={formData.preferredTime} onChange={handleChange}>
                <option value="morning">Morning (9 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                <option value="evening">Evening (5 PM - 8 PM)</option>
              </select>
            </label>

            <label>
              <strong>Description (Optional):</strong>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us more about your requirements..."
                rows="4"
              />
            </label>

            <button type="submit" className="btn-secondary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Callback Request'}
            </button>

            <button type="button" style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => navigate('/service-options')}>
              Back
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
