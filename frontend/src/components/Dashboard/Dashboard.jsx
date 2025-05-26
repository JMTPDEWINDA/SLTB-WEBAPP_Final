import React from 'react';
import './Dashboard.css';
import logo from '../../assets/logo3.png'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="dashboard-container">
      <img src={logo} alt="Sri Lanka Tea Board" className="logo" />

      <div className="dashboard-box">
        <h2>DashBoard</h2>
        <button className="dashboard-btn" onClick={() => navigate('/Home')}> Home</button>
        <button className="dashboard-btn" onClick={() => navigate('/SelectForm')}>New Application </button>
        <button className="dashboard-btn"onClick={() => navigate('/ReferenceEntry')}>Permission Application</button>
        <button className="dashboard-btn" onClick={() => navigate('/TrackStatus')}>Track Status</button>
        <button className="dashboard-btn">Settings</button>
      </div>
    </div>
  );
};

export default Dashboard;
