import React, { useState } from 'react';
import './ReferenceEntry.css';
import logo from '../../assets/logo3.png';

const ReferenceEntry = () => {
  const [referenceNo, setReferenceNo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission logic here
    console.log('Submitted reference number:', referenceNo);
    // You would typically redirect or show another component after submission
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
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ReferenceEntry;