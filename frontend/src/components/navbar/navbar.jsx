import React, { useState } from "react";
import "./navbar.css";
import logo3 from "../../assets/logo3.png"; 
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [menu, setMenu] = useState("Home");
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    // Function to handle navigation
    const handleNavigation = (path, menuItem) => {
        setMenu(menuItem);
        navigate(path);
    };

    const handleLogout = () => {
        logout();
        navigate('/signin');
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
                    onClick={() => handleNavigation("/TrackStatus", "Application Status")} 
                    className={menu === "Application Status" ? "active" : ""}
                >
                    Application Status
                </li>
                {isAuthenticated && (
                    <li 
                        onClick={() => handleNavigation("/Dashboard", "Dashboard")} 
                        className={menu === "Dashboard" ? "active" : ""}
                    >
                        Dashboard
                    </li>
                )}
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {isAuthenticated ? (
                    <>
                        <span style={{ color: '#333', fontSize: '14px' }}>
                            Welcome, {user?.first_name}
                        </span>
                        <button 
                            onClick={handleLogout}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#1900ffff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <button onClick={() => handleNavigation("/signin", "Sign In")}>
                        Sign In
                    </button>
                )}
            </div>
        </div>
    );
};

export default Navbar;
