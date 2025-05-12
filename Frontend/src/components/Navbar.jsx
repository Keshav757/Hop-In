import React from 'react';
import '../styles/Navbar.css';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token'); // Check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    localStorage.removeItem('user');  // Remove user data if stored
    window.location.reload(); // Refresh the page to reflect changes
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <h1>HopIn</h1>
        </div>
        
      </div>
      <div className="navbar-right">
        {!isLoggedIn ? (
          <>
            <button className="navbar-button" onClick={() => navigate('/Authentication')}>Login</button>
            <button className="navbar-button navbar-signup" onClick={() => navigate('/Authentication')}>Signup</button>
          </>
        ) : (
          <>
            <button className="navbar-button" onClick={() => navigate('/profile')}>Profile</button>
            <button className="navbar-button" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
