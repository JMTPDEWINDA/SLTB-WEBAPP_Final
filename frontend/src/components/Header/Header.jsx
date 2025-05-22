import React from 'react'
import './header.css'
import { Link } from 'react-router-dom'


const Header = () => {
  return (
    <div className='header'>
      <div className='header-contents'>
        <h2>Tea Board Assistance Management System</h2>
        <p>The Tea Board Assistance Management System is a web-based application designed to streamline the process of applying for and managing financial assistance for tea replanting and direct planting. This system allows farmers to submit applications online, track their application status, and receive approvals or rejections from Tea Board officers and administrators.</p>   
        <button>
        <Link to="/SignUp" style={{ textDecoration: 'none', color: 'black' }}>Sign Up</Link>
        </button>  
        </div>
    </div>
  )
}

export default Header
