// src/components/HowItWorks.jsx
import React from 'react';
import './HowItWorks.css'; // CSS file for this section

const HowItWorks = () => {
  const steps = [
    {
      icon: '🔍',
      title: 'Browse & Select',
      description: 'Search for chefs based on cuisine, location, or event type. Browse profiles and read reviews.',
    },
    {
      icon: '📅',
      title: 'Book & Customize',
      description: 'Choose a date and time, then discuss your menu preferences and dietary requirements.',
    },
    {
      icon: '🍳',
      title: 'Enjoy Your Meal',
      description: 'Relax as your chef arrives, prepares, serves, and cleans up after a delicious meal.',
    },
  ];

  return (
    <section className="how-it-works">
      <h2 className="hiw-heading">How It Works</h2>
      <p className="hiw-subtitle">Booking your personal chef experience is simple and seamless</p>

      <div className="hiw-steps">
        {steps.map((step, index) => (
          <div className="hiw-card" key={index}>
            <div className="hiw-icon">{step.icon}</div>
            <h3 className="hiw-title">{step.title}</h3>
            <p className="hiw-description">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
