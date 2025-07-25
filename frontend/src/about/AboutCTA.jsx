// src/about/AboutCTA.jsx
import React from 'react';
import './about.css';

const AboutCTA = () => {
  return (
    <section className="about-cta">
      <h2>
        Ready to <span className="cta-highlight">Celebrate Without Stress?</span>
      </h2>
      <p>
        Let our trusted chefs make your next gathering unforgettable. No hassle, just happiness and flavor.
      </p>
      <a href="/book-chef">
        <button className="cta-button">Book Your Chef Now</button>
      </a>
    </section>
  );
};

export default AboutCTA;
