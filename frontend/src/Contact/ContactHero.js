// src/contact/ContactHero.jsx
import React from 'react';
import './contact.css';
import contactImg from '../assests/contact-us.jpg';
const ContactHero = () => {
  return (
    <section className="contact-hero">
      <div className="contact-left">
        <h2 className="contact-title">
          Let's Connect <span className="highlight-orange">With MyChef</span>
        </h2>
        <p className="contact-subtitle">
          Got a question or need a custom chef for your event?<br />
          Reach out, and let’s make your experience unforgettable.
        </p>

        <div className="contact-info">
          <p>📧 <strong>Email:</strong> support@mychef.in</p>
          <p>📍 <strong>Location:</strong> Bhopal, India</p>
          <p>📞 <strong>Phone:</strong> +91 98765 43210</p>
        </div>
      </div>

      <div className="contact-right">
        <img
          src={contactImg}
          alt="Chef talking"
          className="contact-img"
        />
      </div>
    </section>
  );
};

export default ContactHero;
