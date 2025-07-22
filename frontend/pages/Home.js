import React from 'react';
import HeroSection from '../components/HeroSection';
//import ProblemCarousel from '../components/ProblemCarousel';
import ProblemsWeSolve from '../components/ProblemsWeSolve';
import HowItWorks from '../components/HowItWorks';
import UserReviews from '../components/UserReviews';
import OurServices from '../components/OurServices';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
const Home = () => {
  return (
    <div>
      <HeroSection />
      <ProblemsWeSolve/>
       <HowItWorks />
        <OurServices/>
        <UserReviews/>
        <FinalCTA/>
        <Footer/>
    </div>
  );
};

export default Home;
