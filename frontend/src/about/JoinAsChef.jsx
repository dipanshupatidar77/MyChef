// src/about/JoinAsChef.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './about.css';
import joinImg from '../assests/join-chef.jpg';
const JoinAsChef = () => {
  return (
    <section className="join-chef-section">
      <div className="join-chef-content">
        <h2>Join as a <span className="highlight-green">Verified Chef</span></h2>
        <p>Want to showcase your cooking talent and earn from home events? Here's how:</p>

        <ol className="join-steps">
          <li><strong>1. Fill out the Chef Application Form</strong> — Share your experience, specialties & availability.</li>
          <li><strong>2. Get Verified & Approved</strong> — Our team reviews your profile and sends you a confirmation.</li>
          <li><strong>3. Start Accepting Bookings</strong> — Once approved, you'll receive bookings from families near you.</li>
        </ol>

        <Link to="/become-chef">
          <button className="cta-button">Apply as Chef</button>
        </Link>
      </div>

      <div className="join-chef-image">
        <img src={joinImg} alt="Chef Join" />
      </div>
    </section>
  );
};

export default JoinAsChef;
