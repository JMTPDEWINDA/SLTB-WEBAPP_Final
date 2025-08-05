import React from 'react';
import './PlantingForm1.css';

const PlantingForm1 = () => {
  return (
    <div className="simple-form-container">
      <h2>Planting Subsidy Application - 2025</h2>
      <form className="simple-form">
        <label>File No:</label>
        <input type="text" name="file_no" />

        <label>Owner Name:</label>
        <input type="text" name="owner_name" />

        <label>Estate Name:</label>
        <input type="text" name="estate_name" />

        <label>TI Range:</label>
        <input type="text" name="ti_range" />

        <label>Division:</label>
        <input type="text" name="division" />

        <label>Field No:</label>
        <input type="text" name="field_no" />

        <label>Plan No:</label>
        <input type="text" name="plan_no" />

        <label>Planting Type:</label>
        <input type="text" name="planting_type" />

        <label>Approved Extent (Ha):</label>
        <input type="number" step="0.01" name="approved_extent" />

        <label>X1 Coordinate:</label>
        <input type="text" name="x1" />

        <label>X2 Coordinate:</label>
        <input type="text" name="x2" />

        <label>Plants per Ha:</label>
        <input type="number" name="plants_per_ha" />

        <label>Approved No. of Plants:</label>
        <input type="number" name="approved_plants" />

        <label>Amount per Plant (Rs):</label>
        <input type="number" step="0.01" name="amount_per_plant" />

        <label>Total Approved Amount (Rs):</label>
        <input type="number" step="0.01" name="total_approved_amount" />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PlantingForm1;
