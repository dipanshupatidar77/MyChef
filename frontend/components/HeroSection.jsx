import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>
          Discover Personal Chefs for <br />
          Unforgettable Dining Experiences
        </h1>
        <p>Book professional chefs to cook in your home for any occasion</p>

        <p className="subheading">
          From royal Rajasthani thalis to spicy South Indian delights — experience India on a plate.
        </p>

        <div className="tags">
          {['Rajasthani', 'Gujarati', 'South Indian', 'Mughlai', 'Non-Veg Special'].map((item) => (
            <span className="tag" key={item}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
<section className="hero-wrapper">
  <div className="hero-container">
    {/* Your existing hero content */}
  </div>
</section>


export default HeroSection;
