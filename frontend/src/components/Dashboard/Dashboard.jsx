import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import logo from '../../assets/logo3.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dashboardAPI, plantingAPI, replantingAPI } from '../../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [overview, setOverview] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [overviewData, applicationsData] = await Promise.all([
          dashboardAPI.getOverview(),
          dashboardAPI.getApplications()
        ]);
        setOverview(overviewData);
        setApplications(applicationsData.applications || []);
      } catch (error) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <img src={logo} alt="Sri Lanka Tea Board" className="logo" />

      <div className="dashboard-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Dashboard</h2>
          <div>
            <span style={{ marginRight: '15px' }}>Welcome, {user?.first_name} {user?.last_name}</span>
            <button 
              onClick={handleLogout}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#1900ffff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>
        )}

        {overview && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px', 
            marginBottom: '30px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h3>{overview.total_applications}</h3>
              <p>Total Applications</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3>{overview.pending_applications}</h3>
              <p>Pending</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3>{overview.approved_applications}</h3>
              <p>Approved</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3>{overview.rejected_applications}</h3>
              <p>Rejected</p>
            </div>
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <h3>Recent Applications</h3>
          {applications.length > 0 ? (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {applications.map((app, index) => (
                <div key={index} style={{ 
                  padding: '10px', 
                  border: '1px solid #ddd', 
                  marginBottom: '10px', 
                  borderRadius: '4px',
                  backgroundColor: '#fff'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{app.application_type === 'planting' ? 'Planting' : 'Replanting'} Application</strong>
                      <br />
                      <small>File No: {app.file_no} | Estate: {app.estate_name}</small>
                    </div>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '12px',
                      backgroundColor: 
                        app.status === 'approved' ? '#d4edda' : 
                        app.status === 'rejected' ? '#f8d7da' : 
                        app.status === 'processing' ? '#fff3cd' : '#d1ecf1',
                      color: 
                        app.status === 'approved' ? '#155724' : 
                        app.status === 'rejected' ? '#721c24' : 
                        app.status === 'processing' ? '#856404' : '#0c5460'
                    }}>
                      {app.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No applications found</p>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <button className="dashboard-btn" onClick={() => navigate('/Home')}>Home</button>
          <button className="dashboard-btn" onClick={() => navigate('/SelectForm')}>New Application</button>
          <button className="dashboard-btn" onClick={() => navigate('/PlantingForm1')}>Planting Application</button>
          <button className="dashboard-btn" onClick={() => navigate('/ReplantingForm')}>Replanting Application</button>
          <button className="dashboard-btn" onClick={() => navigate('/TrackStatus')}>Track Status</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
