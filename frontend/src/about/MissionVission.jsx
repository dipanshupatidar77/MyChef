import React from 'react';
import './about.css'; // Uses same about.css to stay consistent

const MissionVision = () => {
  return (
    <section className="mission-vision-section">
      <div className="vision-box">
        <h2 className="orange-heading">Our Vision</h2>
        <p>
          We envision a world where every celebration is memorable, not stressful.
          MyChef aims to redefine how people experience food by bringing professional,
          verified chefs to your doorstep — ensuring delicious meals and cherished moments.
        </p>
      </div>

      <div className="mission-box">
        <h2 className="green-heading">Our Mission</h2>
        <p>
          Our mission is to empower households with access to passionate chefs who turn
          ingredients into experiences. We strive to create a trusted community of culinary
          experts and happy families by blending convenience, culture, and cuisine.
        </p>
      </div>
    </section>
  );
};

export default MissionVision;
