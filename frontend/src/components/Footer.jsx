import React from 'react';
import './Footer.css';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-sections">

        <div className="footer-section">
          <h3>Follow Us On</h3>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href=""><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Events We Cover</h3>
          <ul>
            <li>Housewarming Parties</li>
            <li>Birthday Celebrations</li>
            <li>Festive Gatherings</li>
            <li>Kitty Parties</li>
            <li>Family Dinner</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Explore MyChef</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/book-chef">Book-chef </a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/become-chef">Become a Chef</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/admin-login">Admin Pannel</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MyChef. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
