// src/pages/Contact.js
import React from 'react';
import ContactHero from '../Contact/ContactHero';
import Feedback from '../Contact/feedback';
import Footer from '../components/Footer';
import FAQs from '../Contact/FAQ';
const Contact = () => {
  return (
    <>
      <ContactHero />
      <Feedback/>
      <FAQs/>
      <Footer />
    </>
  );
};

export default Contact;
