// src/about/AboutStory.jsx
import React from 'react';
import journeyImage from '../assests/journey-start.jpg'; // 
import './about.css';

const AboutStory = () => {
  return (
    <section className="about-story">
      <div className="story-text">
        <h2>
          <span className="gradient-title">Our Journey Started With</span><br />
          a <span className="highlight-orange">Kitchen Dream</span>
        </h2>
        <p>
          MyChef began with a simple yet powerful idea — to bring the warmth of home-cooked meals 
          into every celebration, without the stress of cooking. It all started with a few passionate chefs 
          and hosts who believed that great food connects people in the most beautiful way.
        </p>
        <p>
          As food lovers ourselves, we saw families spending more time in the kitchen than with their guests. 
          That’s when we decided to change the game — empowering chefs with verified profiles, 
          while giving hosts the time to enjoy their moments. MyChef is now a growing community of chefs, 
          homes, and happiness served fresh!
        </p>
      </div>
      <div className="story-image">
        <img src={journeyImage} alt="Chef preparing food for an event" />
      </div>
    </section>
  );
};

export default AboutStory;
