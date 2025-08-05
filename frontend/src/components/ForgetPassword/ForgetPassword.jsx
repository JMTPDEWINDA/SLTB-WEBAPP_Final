import React, { useState } from 'react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './ForgetPassword.css';
import logo from '../../assets/logo3.png';
import { useAuth } from '../../context/AuthContext';

const ForgetPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: new password
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) clearError();
  };

  const handleGetCode = async () => {
    if (!formData.email) {
      alert('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(formData.email);
      alert('Password reset code has been sent to your email');
      setStep(2);
    } catch (error) {
      console.error('Forgot password error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = () => {
    if (!formData.code) {
      alert('Please enter the verification code');
      return;
    }
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (formData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    // In a real application, you would send the new password to the backend
    alert('Password reset successful! Please sign in with your new password.');
    navigate('/signin');
  };

  return (
    <div className="forget-password-container">
      <img src={logo} alt="Sri Lanka Tea Board" className="logo" />
      <div className="forget-password-box">
        <h2>Forget Password</h2>
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="input-group">
              <label>Enter Your Email:</label>
              <div className="input-with-button">
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button" 
                  className="small-btn" 
                  onClick={handleGetCode}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Get Code'}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="input-group">
              <label>Enter Code:</label>
              <div className="input-with-button">
                <input 
                  type="text" 
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button" 
                  className="small-btn" 
                  onClick={handleVerifyCode}
                >
                  Verify
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <>
              <div className="input-group">
                <label>Enter New Password:</label>
                <div className="input-icon">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />
                  <span onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <div className="input-group">
                <label>Re-Enter New Password:</label>
                <div className="input-icon">
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <button type="submit" className="signin-button">Reset Password</button>
            </>
          )}
        </form>
        <p className="bottom-text">New to this site? <a href="/signup">Sign Up</a></p>
      </div>
    </div>
  );
};

export default ForgetPassword;
