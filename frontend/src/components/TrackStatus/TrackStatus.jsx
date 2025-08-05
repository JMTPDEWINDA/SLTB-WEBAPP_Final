import React, { useState } from 'react';
import './TrackStatus.css';
import logo from '../../assets/logo3.png';
import { referenceAPI } from '../../services/api';

const TrackStatus = () => {
  const [referenceNo, setReferenceNo] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!referenceNo.trim()) {
      setError('Please enter a reference number');
      return;
    }

    setLoading(true);
    setError('');
    setTrackingResult(null);

    try {
      const result = await referenceAPI.trackByReference(referenceNo);
      setTrackingResult(result);
    } catch (error) {
      setError(error.message || 'Failed to track application');
      console.error('Tracking error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reference-container">
      <header className="reference-header">
        <img src={logo} alt="Sri Lanka Tea Board" className="logo" />
        <h1>SRI LANKA TEA BOARD</h1>
      </header>

      <div className="reference-form-container">
        <form onSubmit={handleSubmit} className="reference-form">
          <div className="form-group">
            <label htmlFor="referenceNo">Enter SLTB Reference No:</label>
            <input
              type="text"
              id="referenceNo"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              placeholder="Enter reference number"
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Tracking...' : 'Submit'}
          </button>
        </form>

        {error && (
          <div className="error-message" style={{ color: 'red', marginTop: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {trackingResult && (
          <div className="tracking-result" style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <h3>Application Status</h3>
            <div style={{ marginTop: '15px' }}>
              <p><strong>Reference Number:</strong> {trackingResult.reference_no}</p>
              <p><strong>Application Type:</strong> {trackingResult.application_type}</p>
              <p><strong>Status:</strong> 
                <span style={{ 
                  color: trackingResult.status === 'approved' ? 'green' : 
                         trackingResult.status === 'rejected' ? 'red' : 
                         trackingResult.status === 'processing' ? 'orange' : 'blue',
                  fontWeight: 'bold',
                  marginLeft: '5px'
                }}>
                  {trackingResult.status.toUpperCase()}
                </span>
              </p>
              <p><strong>Owner Name:</strong> {trackingResult.owner_name}</p>
              <p><strong>Estate Name:</strong> {trackingResult.estate_name}</p>
              <p><strong>File Number:</strong> {trackingResult.file_no}</p>
              {trackingResult.comments && (
                <p><strong>Comments:</strong> {trackingResult.comments}</p>
              )}
              <p><strong>Submitted Date:</strong> {new Date(trackingResult.created_at).toLocaleDateString()}</p>
              <p><strong>Last Updated:</strong> {new Date(trackingResult.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackStatus;