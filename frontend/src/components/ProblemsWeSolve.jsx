import React from 'react';
import Slider from 'react-slick';
import './ProblemsWeSolve.css';

import icon1 from '../assests/host-stress.png';
import icon2 from '../assests/dine-home.png';
import icon3 from '../assests/find-chef.png';
import icon4 from '../assests/women-break.png';

const problems = [
  {
    title: "Hosting Shouldn’t Be a Burden",
    subtitle: "From cooking to cleanup — hosting a party often means missing the party.",
    icon: icon1,
  },
  {
    title: "Why Go Out, When You Can Dine In?",
    subtitle: "Restaurants are noisy, crowded, and impersonal. Let our chefs come to you.",
    icon: icon2,
  },
  {
    title: "Hiring a Chef Shouldn’t Be a Struggle",
    subtitle: "Finding trustworthy chefs used to be hard. With MyChef, it’s just a few clicks away.",
    icon: icon3,
  },
  {
    title: "Give Yourself a Break — We’ll Handle the Kitchen",
    subtitle: "From kitchen to chaos — you’ve done it all. This time, sit back, savor, and smile. We’ll cook the joy.",
    icon: icon4,
  },
];

const ProblemsWeSolve = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 300,
    autoplaySpeed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <section className="problems-section">
      <h2 className="problems-heading">Why MyChef?</h2>
      <div className="slider-wrapper">
        <Slider {...settings} className="problems-slider">
          {problems.map((item, index) => (
            <div className="problem-card-wrapper" key={index}>
              <div className="problem-card-split">
                <div className="problem-img">
                  <img src={item.icon} alt={item.title} />
                </div>
                <div className="problem-text">
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default ProblemsWeSolve;
