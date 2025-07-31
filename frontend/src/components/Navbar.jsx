import React from 'react'
import "./Navbar.css"
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <nav>
        <h2>Shopy</h2>
        <div className='search'>
            <input type="text" />
            <i className="ri-search-line"></i>
        </div>
        <div className="right">
          <Link to="/admin/products/add">Add new Product</Link>
          <button onClick={handleLogout} className="logout-btn">
            <i className="ri-logout-box-line"></i>
            Logout
          </button>
        </div>
    </nav>
  )
}

export default Navbar
