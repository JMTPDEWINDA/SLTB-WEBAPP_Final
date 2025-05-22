import React from 'react';
import './ReplantingForm.css';
import logo from '../../assets/logo3.png';

const ReplantingForm = () => {
  return (
    <div className="form-container">
      <header className="form-header">
        <img src={logo} alt="Sri Lanka Tea Board" className="logo" />
        <h1>APPLICATION FOR FINANCIAL ASSISTANCE</h1>
        <h2>FOR RE PLANTING/ NEW PLANTING OF TEA WITH MECHANIZATION IN CORPORATE AND PRIVATE SECTOR TEA ESTATES MORE THAN 10 ACRES</h2>
        <h3>2025</h3>
      </header>

      <form className="application-form">
        <div className="form-section">
          <div className="planting-options">
            <span>Re Planting -</span>
            <span>Direct Planting-</span>
          </div>
          
          {/* Section 1 */}
          <div className="form-group">
            <label>1.0 Name and Address of Regional plantation company / owner of the private estates more than 10 acres:</label>
            <div className="sub-group">
              <input type="text" placeholder="I. Name" />
              <textarea placeholder="II. Address"></textarea>
              <div className="contact-group">
                <input type="text" placeholder="III. Contact No - Tel" />
                <input type="text" placeholder="Fax" />
                <input type="email" placeholder="Email" />
              </div>
              <input type="text" placeholder="IV. National Identity Card No" />
              <input type="text" placeholder="V. SLTB Tea Land Registration No" />
            </div>
          </div>

          {/* Section 2 */}
          <div className="form-group">
            <label>2.0 Name of estate where Re planting is carried out:</label>
            <input type="text" />
          </div>

          {/* Section 3 */}
          <div className="form-group">
            <label>3.0 Name of the Division and field number of the estate where Re planting is carried out:</label>
            <p className="form-note">(For each field where replanting is carried out, a separate application must be furnished)</p>
            <div className="sub-group">
              <input type="text" placeholder="I. Division" />
              <input type="text" placeholder="II. Field No" />
            </div>
            <p className="form-note">
              i. Please attach a certified copy of the registered deed or lease agreement of the estate and survey plan prepared by a licensed surveyor where relevant division and the block of land/field clearly marked.
            </p>
            <p className="form-note">
              ii. The relevant division / block of land/field's which the subsidies are claimed must be indicate clearly in a manner where they could be identified by the inspecting officer.
            </p>
          </div>

          {/* Section 4 */}
          <div className="form-group">
            <label>4.0 Address of estate:</label>
            <textarea></textarea>
            <div className="contact-table">
              <div className="contact-row">
                <span>Contact No</span>
                <input type="text" placeholder="Tel" />
                <input type="text" placeholder="Fax" />
                <input type="email" placeholder="Email" />
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="form-group">
            <label>5.0 Name of the Manager of the estate:</label>
            <input type="text" />
          </div>

          {/* Section 6 */}
          <div className="form-group">
            <label>6.0 Details of the Land:</label>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Total Extent (Ha)</th>
                    <th>Extent Under Tea</th>
                    <th>Extent for which subsidy is claimed</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><input type="text" /></td>
                    <td><input type="text" /></td>
                    <td><input type="text" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 7 */}
          <div className="form-group">
            <label>7.0 Survey plan No:</label>
            <input type="text" />
            <label>Date:</label>
            <input type="date" />
          </div>

          {/* Section 8 */}
          <div className="form-group">
            <label>8.0</label>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Administrative District</th>
                    <th>D S Division</th>
                    <th>Grama Niladari Division</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><input type="text" /></td>
                    <td><input type="text" /></td>
                    <td><input type="text" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 9 */}
          <div className="form-group">
            <label>9.0 Please provide the details regarding the legal possession of the estate where Re planting subsidy is applied:</label>
            <textarea></textarea>
            <p className="form-note">(please attach certified copies of documents)</p>
          </div>

          {/* Section 11 */}
          <div className="form-group">
            <label>11.0 Have you previously obtained/applied for Re planting subsidies for the same field/block of land under this subsidy scheme.</label>
            <p className="form-note">(If so please provide following details)</p>
            <input type="text" placeholder="SLTB Reference No:" />
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th rowSpan="2">Division & block/field land</th>
                    <th colSpan="5">Stage of Direct planting and amounting of subsidy per Ha and the stage of payment</th>
                    <th rowSpan="2">Extent (Ha)</th>
                    <th rowSpan="2">Total amount & date of subsidy Received (Rs/Cts)</th>
                  </tr>
                  <tr>
                    <th>Stage 1</th>
                    <th>Stage 2</th>
                    <th>Stage 3</th>
                    <th>Stage 4</th>
                    <th>Stage 5</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((row) => (
                    <tr key={row}>
                      <td><input type="text" /></td>
                      <td><input type="text" /></td>
                      <td><input type="text" /></td>
                      <td><input type="text" /></td>
                      <td><input type="text" /></td>
                      <td><input type="text" /></td>
                      <td><input type="text" /></td>
                      <td><input type="text" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 12 */}
          <div className="form-group">
            <label>12.0 Please provide the following details related to the estate/field/block of land where you intended to direct plant under this subsidy scheme.</label>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Division & block/field of land</th>
                    <th>Extent (ha)</th>
                    <th>Total amount of subsidy claim (Rs/Cts)</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((row) => (
                    <tr key={row}>
                      <td><input type="text" /></td>
                      <td><input type="text" /></td>
                      <td><input type="text" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 13 */}
          <div className="form-group">
            <label>13.0 Payment details of the beneficiary:</label>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name of the Beneficiary</th>
                    <th>NIC Number</th>
                    <th>Name of the Account</th>
                    <th>Account No</th>
                    <th>Name of the Bank and Branch</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><input type="text" /></td>
                    <td><input type="text" /></td>
                    <td><input type="text" /></td>
                    <td><input type="text" /></td>
                    <td><input type="text" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Certification Section */}
          <div className="certification-section">
            <p>I certify that the information provided in this application is true and accurate to the best of my knowledge:</p>
            
            <div className="signature-block">
              <div className="applicant-info">
                <span>Name and designation of the person furnishing this application:</span>
                <input type="text" className="designation-input" />
              </div>
              
              <div className="signature-fields">
                <div className="signature-box">
                  <input 
                    type="text" 
                    className="signature-input" 
                    placeholder="Sign here" 
                    disabled 
                  />
                  <span>Signature</span>
                </div>
                
                <div className="date-box">
                  <input type="date" className="date-input" />
                  <span>Date</span>
                </div>
              </div>
              
              <p className="authorization-note">
                (CEO of the Company/owner or a person authorized by him in writing, is authorized to sign this application. Please attach the letter of authorization).
              </p>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="form-footer">
            <p>1. Please provide all information and documents required by this application right first time to avoid delays.</p>
            <p>2. Please provide all necessary assistance to the inspecting officer of the Sri Lanka Tea Board to conduct his inspection.</p>
            <p>3. For further details about this subsidy scheme please refer circular letter No. TB/TC/DP/2025 dated 23 January 2025.</p>
          </div>

          <button type="submit" className="submit-btn">Submit Application</button>
        </div>
      </form>
    </div>
  );
};

export default ReplantingForm;