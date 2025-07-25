import React from 'react';
import chefCookingImg from '../assests/chef-cooking.jpg';
import happyfamilyImg from '../assests/happy-family.jpg'; 
import happywomenImg from '../assests/happy-women.jpg';
import './about.css';

const AboutHero = () => {
  return (
    <section className="about-hero">
      <h1>   
        Let the <span className="highlight-orange">Celebration Begin</span>,<br />
        <span className="highlight-green">We’ll Handle the Kitchen</span>
      </h1>

      <p className="sub-heading-animated">
        MyChef connects families with <span className="highlight-brown">verified chefs</span> for all your special occasions.
        Sit back, relax, and enjoy precious time with your loved ones while we cook up the memories.
      </p>

      <div className="hero-images">
        <img src={chefCookingImg} alt="Chef cooking" />
        <img src={happyfamilyImg} alt="Family enjoying" />
        <img src={happywomenImg} alt="Relaxing woman" />
      </div>

      <h3 className="highlight-line animated-text">
        Empowering Homes With <span className="highlight-brown">Verified Chefs</span> for a
        <span className="highlight-orange"> Delicious Experience</span>
      </h3>
    </section>
  );
};

export default AboutHero;
