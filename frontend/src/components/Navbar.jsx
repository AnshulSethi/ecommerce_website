import React, { useState } from 'react';
import "./Navbar.css";
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onSearch, searchQuery = "" }) => {
  const navigate = useNavigate();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <nav>
      <h2>Fur & Feeds</h2>
      <div className='search'>
        <input 
          type="text" 
          placeholder="Search products..."
          value={localSearchQuery}
          onChange={handleSearchChange}
        />
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
  );
};

export default Navbar;
