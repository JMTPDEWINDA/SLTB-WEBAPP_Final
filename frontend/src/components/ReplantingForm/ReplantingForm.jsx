import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReplantingForm.css';
import { replantingAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ReplantingForm = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    file_no: '',
    owner_name: '',
    estate_name: '',
    ti_range: '',
    division: '',
    field_no: '',
    plan_no: '',
    replanting_type: '',
    approved_extent: '',
    x1_coordinate: '',
    x2_coordinate: '',
    plants_per_ha: '',
    approved_plants: '',
    amount_per_plant: '',
    total_approved_amount: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check authentication
  React.useEffect(() => {
    if (!isAuthenticated) {
      alert('Please sign in to submit an application');
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const calculateTotalAmount = () => {
    const plants = parseFloat(formData.approved_plants) || 0;
    const amount = parseFloat(formData.amount_per_plant) || 0;
    const total = plants * amount;
    setFormData(prev => ({
      ...prev,
      total_approved_amount: total.toFixed(2)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please sign in to submit an application');
      navigate('/signin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await replantingAPI.apply(formData);
      alert(`Replanting application submitted successfully! Reference Number: ${response.reference_no}`);
      navigate('/Dashboard');
    } catch (error) {
      setError(error.message || 'Failed to submit application');
      console.error('Replanting application error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="simple-form-container">
      <h2>Replanting Subsidy Application - 2025</h2>
      {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <form className="simple-form" onSubmit={handleSubmit}>
        <label>File No:</label>
        <input 
          type="text" 
          name="file_no" 
          value={formData.file_no}
          onChange={handleChange}
          required
        />

        <label>Owner Name:</label>
        <input 
          type="text" 
          name="owner_name" 
          value={formData.owner_name}
          onChange={handleChange}
          required
        />

        <label>Estate Name:</label>
        <input 
          type="text" 
          name="estate_name" 
          value={formData.estate_name}
          onChange={handleChange}
          required
        />

        <label>TI Range:</label>
        <input 
          type="text" 
          name="ti_range" 
          value={formData.ti_range}
          onChange={handleChange}
        />

        <label>Division:</label>
        <input 
          type="text" 
          name="division" 
          value={formData.division}
          onChange={handleChange}
        />

        <label>Field No:</label>
        <input 
          type="text" 
          name="field_no" 
          value={formData.field_no}
          onChange={handleChange}
        />

        <label>Plan No:</label>
        <input 
          type="text" 
          name="plan_no" 
          value={formData.plan_no}
          onChange={handleChange}
        />

        <label>Replanting Type:</label>
        <input 
          type="text" 
          name="replanting_type" 
          value={formData.replanting_type}
          onChange={handleChange}
          required
        />

        <label>Approved Extent (Ha):</label>
        <input 
          type="number" 
          step="0.01" 
          name="approved_extent" 
          value={formData.approved_extent}
          onChange={handleChange}
          required
        />

        <label>X1 Coordinate:</label>
        <input 
          type="text" 
          name="x1_coordinate" 
          value={formData.x1_coordinate}
          onChange={handleChange}
        />

        <label>X2 Coordinate:</label>
        <input 
          type="text" 
          name="x2_coordinate" 
          value={formData.x2_coordinate}
          onChange={handleChange}
        />

        <label>Plants per Ha:</label>
        <input 
          type="number" 
          name="plants_per_ha" 
          value={formData.plants_per_ha}
          onChange={handleChange}
          required
        />

        <label>Approved No. of Plants:</label>
        <input 
          type="number" 
          name="approved_plants" 
          value={formData.approved_plants}
          onChange={handleChange}
          onBlur={calculateTotalAmount}
          required
        />

        <label>Amount per Plant (Rs):</label>
        <input 
          type="number" 
          step="0.01" 
          name="amount_per_plant" 
          value={formData.amount_per_plant}
          onChange={handleChange}
          onBlur={calculateTotalAmount}
          required
        />

        <label>Total Approved Amount (Rs):</label>
        <input 
          type="number" 
          step="0.01" 
          name="total_approved_amount" 
          value={formData.total_approved_amount}
          onChange={handleChange}
          required
          readOnly
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default ReplantingForm;