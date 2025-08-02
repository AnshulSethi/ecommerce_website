import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../../components/Navbar.css";

const UserNav = ({ onSearch, searchQuery = "" }) => {
  const [cartCount, setCartCount] = useState(0);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cart`);
      console.log("Cart count fetched:", response.data);
      const totalItems = response.data.reduce((total, item) => total + item.quantity, 0);
      setCartCount(totalItems);
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartCount(0);
    }
  };

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
    <nav className="user-nav">
      <Link to="/user" className="nav-brand">
        <h2>Fur & Feeds</h2>
      </Link>

      <div className='search'>
        <input 
          type="text" 
          placeholder="Search products..."
          value={localSearchQuery}
          onChange={handleSearchChange}
        />
        <i className="ri-search-line"></i>
      </div>

      <div className="nav-right">
        <div className="nav-cart">
          <Link to="/cart" className="cart-link">
            <i className="ri-shopping-cart-line"></i>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <i className="ri-logout-box-line"></i>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default UserNav;
