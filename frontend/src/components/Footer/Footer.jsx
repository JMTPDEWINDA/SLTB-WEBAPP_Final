import React from "react";
import "./Footer.css";
import { FaFacebookF, FaTwitter, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <div className="social-icons">
            <a href="#" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
          </div>
          <div className="contact-info">
            <div className="info-item">
              <FaMapMarkerAlt className="icon" />
              <p>574, Galle Road, Colombo 3, Sri Lanka.</p>
            </div>
            <div className="info-item">
              <FaPhoneAlt className="icon" />
              <p>(+94) 112 58 78 14</p>
            </div>
            <div className="info-item">
              <FaEnvelope className="icon" />
              <p>teaboard@pureceylontea.com</p>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Copyright © Sri Lanka Tea Board | All Rights Reserved</p>
        <p>Developed By J M T P Devinda (BSc. (Hons) In Computer Science,NSBM Green University,Sri Lanka)</p> 
        <p>Collaborated With W P S Sandaruwan (BSc. (Hons) In Computer Science,NSBM Green University, Sri Lanka)</p>
      </div>
    </footer>
  );
};

export default Footer;
