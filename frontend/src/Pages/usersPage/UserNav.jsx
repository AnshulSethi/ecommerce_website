import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../../components/Navbar.css";

const UserNav = () => {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await axios.get('http://localhost:3000/cart');
      const totalItems = response.data.reduce((total, item) => total + item.quantity, 0);
      setCartCount(totalItems);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <nav className="user-nav">
      <Link to="/user" className="nav-brand">
        <h2>Shopy</h2>
      </Link>

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
