import React from 'react';
import './OurServices.css';

const services = [
  {
    icon: '👨‍🍳',
    title: 'Book a Chef',
    description: 'Hire verified chefs for parties and home dining.',
    features: ['Event-ready chefs', 'Custom menus', 'Chef ratings & reviews'],
  },
  {
    icon: '📆',
    title: 'Weekly Chef Service',
    description: 'Get a personal chef for weekly meal prep at your convenience.',
    features: ['Coming Soon'],
    comingSoon: true,
  },
  {
    icon: '📅',
    title: 'Monthly Chef Subscription',
    description: 'Book a recurring chef for your home events each month.',
    features: ['Coming Soon'],
    comingSoon: true,
  },
];

const OurServices = () => {
  return (
    <section className="our-services">
      <h2 className="services-title">Services We Offer</h2>
      <p className="services-subtitle">
        From festive events to daily cooking help, MyChef offers flexible culinary services.
      </p>

      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <div className="service-icon">{service.icon}</div>
            <h3 className="service-heading">{service.title}</h3>
            <p className="service-description">{service.description}</p>
            <ul className="service-features">
              {service.features.map((feature, idx) => (
                <li
                  key={idx}
                  className={feature === 'Coming Soon' ? 'coming-soon' : ''}
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurServices;
