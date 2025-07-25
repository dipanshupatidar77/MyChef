import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BecomeChef.css';

const BecomeChef = () => {
  const navigate = useNavigate();

  return (
    <div className="become-chef-page">
      <header className="chef-hero">
        <h1>👨‍🍳 Become a Chef with <span>MyChef</span></h1>
        <p>Share your culinary passion and earn by showcasing your skills to homes across India.</p>
        <button className="join-btn" onClick={() => navigate('/register')}>
          Join Us
        </button>
      </header>

      <section className="chef-steps">
        <h2>🚀 How to Get Started</h2>
        <div className="steps-container">
          <div className="step-card">
            <h3>1. Register Online</h3>
            <p>Fill in your profile, including dishes, charges, timings, and more. Upload your photo and credentials.</p>
          </div>
          <div className="step-card">
            <h3>2. Profile Review</h3>
            <p>Our Admin team will verify your profile and get in touch for the next step.</p>
          </div>
          <div className="step-card">
            <h3>3. Skill Test (Offline)</h3>
            <p>You’ll be invited to an offline cooking assessment. Details will be shared via email.</p>
          </div>
          <div className="step-card">
            <h3>4. Approval</h3>
            <p>Based on your performance, Admin will approve your profile. You’ll be notified manually.</p>
          </div>
          <div className="step-card">
            <h3>5. Start Receiving Bookings</h3>
            <p>Once approved, your profile will be live. Users can book your services directly from the platform.</p>
          </div>
        </div>
      </section>

      <section className="chef-privacy">
        <h2>🔐 Chef Guidelines & Policies</h2>
        <ul>
          <li><strong>Payments:</strong> Your share will be transferred within 48 hours after the event ends.</li>
          <li><strong>Booking Cancellations:</strong> Chefs are allowed <strong>2 free cancellations</strong> per month. Beyond that, deductions may apply.</li>
          <li><strong>User Cancellations:</strong> If a user cancels within 24 hours of event time, partial payment is still credited to the chef.</li>
          <li><strong>Data Privacy:</strong> Your personal details and booking history are only visible to Admin and authorized users.</li>
          <li><strong>Code of Conduct:</strong> Chefs must maintain hygiene, punctuality, and professional behavior during every service.</li>
        </ul>
      </section>

      <footer className="join-footer">
        <h3>🎯 Ready to cook up success?</h3>
        <button className="join-btn" onClick={() => navigate('/register')}>Join Us Now</button>
      </footer>
    </div>
  );
};

export default BecomeChef;
