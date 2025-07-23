// src/pages/About.js
import React from 'react';
import AboutHero from '../about/AboutHero';
import AboutStory from 'about/AboutStory';
import MissionVision from '../about/MissionVission';
import JoinAsChef from '../about/JoinAsChef';
import AboutCTA from '../about/AboutCTA';
import Footer from '../components/Footer.jsx';
import '../about/about.css';

const About = () => {
  return (
    <div className="about-page">
      <AboutHero />
      <AboutStory/>
      <MissionVision/>
      <JoinAsChef />
      <AboutCTA/>
      <Footer/>
    </div>
  );
};

export default About;
