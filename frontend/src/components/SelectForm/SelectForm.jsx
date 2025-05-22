import React from 'react';
import './SelectForm.css';
import logo from '../../assets/logo3.png'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';

const SelectForm = () => {
    const navigate = useNavigate();
  return (
    <div className="select-form-container">
      <img src={logo} alt="Sri Lanka Tea Board" className="logo" />

      <div className="form-selection-box">
        <h2>Select the Form</h2>
        
        

        <button className="form-option-btn" onClick={() => navigate('/PlantingForm1')}>
        Infilling or Direct Planting
    </button>
        
        <button className="form-option-btn" onClick={() => navigate('/ReplantingForm')}>
          Re Planting or New Planting
        </button>
      </div>
    </div>
  );
};

export default SelectForm;