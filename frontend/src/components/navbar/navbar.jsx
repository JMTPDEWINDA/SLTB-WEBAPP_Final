import React, { useState } from "react";
import "./navbar.css";
import logo3 from "../../assets/logo3.png"; 
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [menu, setMenu] = useState("Home");
    const navigate = useNavigate();

    // Function to handle navigation
    const handleNavigation = (path, menuItem) => {
        setMenu(menuItem);
        navigate(path);
    };

    return (
        <div className="navbar">
            {/* Make logo clickable to home */}
            <Link to="/Home" onClick={() => setMenu("Home")}>
                <img src={logo3} alt="logo Icon" className="logo3" />
            </Link>

            <ul className="navbar-menu">
                <li 
                
                    
                    onClick={() => handleNavigation("/Home", "Home")} 
                    className={menu === "Home" ? "active" : ""}
                >
                    Home
                </li>
                <li 
                    onClick={() => handleNavigation("/application-status", "Application Status")} 
                    className={menu === "Application Status" ? "active" : ""}
                >
                    Application Status
                </li>
                <li 
                    onClick={() => handleNavigation("/about", "About")} 
                    className={menu === "About" ? "active" : ""}
                >
                    About
                </li>
                <li 
                    onClick={() => handleNavigation("/contact", "Contact")} 
                    className={menu === "Contact" ? "active" : ""}
                >
                    Contact
                </li>
            </ul>

            <button onClick={() => handleNavigation("/signin", "Sign In")}>
                Sign In
            </button>
        </div>
    );
};

export default Navbar;
