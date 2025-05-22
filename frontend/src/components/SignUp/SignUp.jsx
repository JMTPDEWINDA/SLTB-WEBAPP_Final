import React from 'react';
import './SignUp.css';
import logo3 from '../../assets/logo3.png';
import { Link } from 'react-router-dom';

const SignUpForm = () => {
  return (
    <div className="signup-container">
      <img src={logo3} alt="Sri Lanka Tea Board" className="logo" />
      <h1 className="signup-title">Sign Up</h1>
      <form className="signup-form">
        <div className="form-row">
          <div className="form-group">
            <label>First Name:</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input type="text" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Email:</label>
            <input type="email" />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input type="text" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Password:</label>
            <input type="password" />
          </div>
          <div className="form-group">
            <label>Re Enter Password:</label>
            <input type="password" />
          </div>
        </div>
        <button type="submit" className="signup-button">Sign Up</button>
        <p className="signin-text">
          Already have an account? <Link to="/SignIn">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
