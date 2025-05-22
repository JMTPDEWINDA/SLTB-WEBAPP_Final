import React, { useState } from 'react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import './ForgetPassword.css';
import logo from '../../assets/logo3.png'; // Update the path as needed


const ForgetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="forget-password-container">
      <img src={logo} alt="Sri Lanka Tea Board" className="logo" />
      <div className="forget-password-box">
        <h2>Forget Password</h2>
        <form>
          <div className="input-group">
            <label>Enter Your Email:</label>
            <div className="input-with-button">
              <input type="email" />
              <button type="button" className="small-btn">Get Code</button>
            </div>
          </div>

          <div className="input-group">
            <label>Enter Code:</label>
            <div className="input-with-button">
              <input type="text" />
              <button type="button" className="small-btn">Verify</button>
            </div>
          </div>

          <div className="input-group">
            <label>Enter New Password:</label>
            <div className="input-icon">
              <input type={showPassword ? 'text' : 'password'} />
              <span onClick={() => setShowPassword(!showPassword)}>
                
              </span>
            </div>
          </div>

          <div className="input-group">
            <label>Re-Enter New Password:</label>
            <div className="input-icon">
              <input type={showConfirmPassword ? 'text' : 'password'} />
              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                
              </span>
            </div>
          </div>

          <button type="submit" className="signin-button">Sign In</button>
        </form>
        <p className="bottom-text">New to this site? <a href="#">Sign Up</a></p>
      </div>
    </div>
  );
};

export default ForgetPassword;
