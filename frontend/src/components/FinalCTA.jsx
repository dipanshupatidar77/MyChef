import React from 'react';
import './FinalCTA.css';

const FinalCTA = () => {
  return (
    <section className="final-cta-section">
      <div className="cta-content">
        <h2>Let’s Make Hosting Effortless</h2>
        <p>Whether you're planning a cozy dinner or a grand event — MyChef has your back.</p>
       <a href="/book-chef">
  <button className="cta-btn">Explore Our Chefs</button>
</a>
      </div>

      <div className="chef-card">
        <h3>Are You a Talented Chef?</h3>
        <p>Join our growing team of home chefs and share your passion with families across the city.</p>
     <a href="/become-chef">
  <button className="cta-btn">Become a Chef</button>
</a>

      </div>
    </section>
  );
};

export default FinalCTA;
