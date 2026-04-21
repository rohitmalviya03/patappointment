import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const SampleCollection = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    sampleType: '',
    preferredDate: '',
    preferredTime: 'morning',
    testName: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/samples', {
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
        alert('Sample collection request submitted successfully! We will contact you shortly.');
        navigate('/service-options');
      }
    } catch (err) {
      setError('Failed to submit sample collection request');
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
        <h2>🏠 Home Sample Collection</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Request home sample collection at your convenience
        </p>

        {error && (
          <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#fee2e2', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <h3>Personal Information</h3>

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

            <h3>Collection Address</h3>

            <label>
              <strong>Street Address:</strong>
              <input
                type="text"
                name="street"
                value={formData.address.street}
                onChange={handleAddressChange}
                placeholder="Building/House Number & Street"
                required
              />
            </label>

            <label>
              <strong>City:</strong>
              <input
                type="text"
                name="city"
                value={formData.address.city}
                onChange={handleAddressChange}
                placeholder="City"
                required
              />
            </label>

            <label>
              <strong>State:</strong>
              <input
                type="text"
                name="state"
                value={formData.address.state}
                onChange={handleAddressChange}
                placeholder="State"
              />
            </label>

            <label>
              <strong>ZIP Code:</strong>
              <input
                type="text"
                name="zipCode"
                value={formData.address.zipCode}
                onChange={handleAddressChange}
                placeholder="ZIP Code"
              />
            </label>

            <h3>Sample Details</h3>

            <label>
              <strong>Sample Type:</strong>
              <select name="sampleType" value={formData.sampleType} onChange={handleChange} required>
                <option value="">Select sample type...</option>
                <option value="blood">Blood</option>
                <option value="urine">Urine</option>
                <option value="saliva">Saliva</option>
                <option value="throat-swab">Throat Swab</option>
                <option value="nasal-swab">Nasal Swab</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label>
              <strong>Test Name:</strong>
              <input
                type="text"
                name="testName"
                value={formData.testName}
                onChange={handleChange}
                placeholder="e.g., COVID Test, Blood Test"
                required
              />
            </label>

            <h3>Schedule Preference</h3>

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
              <strong>Special Instructions (Optional):</strong>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g., Fasting required, diabetic patient, etc."
                rows="3"
              />
            </label>

            <button type="submit" style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              width: '100%',
              marginBottom: '10px'
            }} disabled={loading}>
              {loading ? 'Submitting...' : 'Request Sample Collection'}
            </button>

            <button type="button" style={{ padding: '10px 20px', backgroundColor: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }} onClick={() => navigate('/service-options')}>
              Back
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
