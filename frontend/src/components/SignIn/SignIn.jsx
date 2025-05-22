import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // import eye icons
import './SignIn.css';
import logo3 from '../../assets/logo3.png';
import { Link } from 'react-router-dom';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="signin-container">
      <img src={logo3} alt="Sri Lanka Tea Board" className="logo" />
      <h1 className="signin-title">Sign In</h1>
      <form className="signin-form">
        <div className="form-group">
          <label>Email:</label>
          <input type="email" />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <div className="password-wrapper">
            <input type={showPassword ? 'text' : 'password'} />
            <span
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              
            </span>
          </div>
        </div>
        <div className="forgot-password">
        <Link to="/ForgetPassword">Forget Password?</Link>
        </div>
        <button className="signin-button"><Link to="/Dashboard">Sign In</Link></button>
        <p className="bottom-text">
          New to this site? <Link to="/SignUp">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
