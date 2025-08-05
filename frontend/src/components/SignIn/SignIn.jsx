import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';
import logo3 from '../../assets/logo3.png';
import { useAuth } from '../../context/AuthContext';

const SignInForm = () => {
  const navigate = useNavigate();
  const { signin, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) clearError(); // Clear error on user input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validations
    if (!formData.email || !formData.password) {
      alert('Please fill in all fields!');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Please enter a valid email address!');
      return;
    }

    setLoading(true);
    try {
      const response = await signin(formData);
      
      if (response.success) {
        alert('Login successful! Welcome back.');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Signin error:', error);
      // Error is already handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <img src={logo3} alt="Sri Lanka Tea Board" className="logo" />
      <h1 className="signin-title">Welcome Back</h1>
      <p className="signin-subtitle">Sign in to your SLTB account</p>

      {error && (
        <div className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
          {Array.isArray(error)
            ? error.map((e, index) => <div key={index}>{e}</div>)
            : error}
        </div>
      )}

      <form className="signin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address:</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" className="signin-button" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        
      </form>
    </div>
  );
};

export default SignInForm;
