import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken") || localStorage.getItem("chefToken");
    const role = localStorage.getItem("userRole");
    setIsLoggedIn(!!token);
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("chefToken");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserRole(null);
    window.location.href = '/';
  };

  const handleProfileClick = () => {
    if (userRole === 'chef') {
      navigate('/chef/dashboard');
    } else if (userRole === 'user') {
      navigate('/my-bookings');
    }
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          👨‍🍳 MyChef
        </Link>
      </div>

      <ul className="navbar-links">
        <li><Link to="/book-chef">Explore Chefs</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/contact">Contact</Link></li>

        {isLoggedIn && userRole === 'user' && (
          <li><Link to="/user/profile">Profile</Link></li>
        )}
        {isLoggedIn && userRole === 'chef' && (
          <li><Link to="/chef/profile">Profile</Link></li>
        )}

        {isLoggedIn ? (
          <>
            <li>
              <button className="navbar-btn" onClick={handleProfileClick}>
                {userRole === 'chef' ? 'Dashboard' : 'My Bookings'}
              </button>
            </li>
            <li>
              <button className="navbar-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
