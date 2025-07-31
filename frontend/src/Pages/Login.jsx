import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (userType.toLowerCase() === 'admin') {
      navigate('/admin/');
    } else if (userType.toLowerCase() === 'user') {
      navigate('/user');
    } else {
      alert('Please enter "user" or "admin"');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome to Shopy</h1>
        <p>Enter your role to continue</p>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter 'user' or 'admin'"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        
        <div className="login-info">
          <p><strong>For testing:</strong></p>
          <p>• Enter "user" to access user features</p>
          <p>• Enter "admin" to access admin features</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 