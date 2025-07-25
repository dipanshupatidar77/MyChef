// src/about/ContactFAQ.jsx
import React, { useState } from 'react';
import './contact.css';

const faqs = {
  users: [
    { q: "What is MyChef?", a: "MyChef is a platform that allows users to book verified chefs for home-based events, parties, or special occasions." },
    { q: "How do I book a chef?", a: "Sign up as a user, browse available chefs, pick one for your date, and complete the booking form." },
    { q: "Can I cancel a booking?", a: "Yes, from your dashboard. Cancellation policies may vary based on timing." },
    { q: "What if chef cancels last minute?", a: "We’ll notify you immediately and try to assign a new chef or issue a refund." },
    { q: "How do I make payments?", a: "All payments go through our secure gateway with confirmation after success." },
    { q: "Can I rate and review a chef?", a: "Absolutely! You’ll be prompted to leave a rating and review after your event." },
    { q: "Is my info safe?", a: "Yes. Only your booked chef sees it, and it’s protected by secure systems." },
    { q: "How do I contact support?", a: "Via the Contact Us page or from your dashboard’s support tab." },
    { q: "Can I make multiple bookings?", a: "Yes, as long as dates don’t overlap." },
    { q: "What if chef is already booked?", a: "You'll be notified, and alternatives will be suggested." },
  ],
  chefs: [
    { q: "How do I register as a chef?", a: "Go to 'Register as Chef', complete the form, and submit it for admin approval." },
    { q: "Why is admin approval required?", a: "To maintain quality, all profiles are reviewed. Verified chefs get a login approval code." },
    { q: "Can I accept or reject bookings?", a: "Yes, based on your availability via your dashboard." },
    { q: "How will I get booking notifications?", a: "You’ll get emails and dashboard notifications." },
    { q: "Can I cancel a booking?", a: "Yes, but frequent cancellations affect your profile score." },
    { q: "Can I block unavailable dates?", a: "This feature is coming soon. Currently managed by accepting or rejecting." },
    { q: "How do I get paid?", a: "After successful bookings and verification, payments are processed to your linked account." },
    { q: "Can I edit my profile?", a: "Yes — cuisine, experience, service area, etc." },
    { q: "How are chefs rated?", a: "Users rate after each event. Better ratings = better visibility." },
    { q: "Is there a commission?", a: "Yes, a small service fee applies per booking. Details in your dashboard." },
  ]
};

const FAQItem = ({ faq }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
      <div className="faq-question">{faq.q}</div>
      {open && <div className="faq-answer">{faq.a}</div>}
    </div>
  );
};

const ContactFAQ = () => {
  return (
    <section className="faq-section">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-columns">
        <div className="faq-column">
          <h3 className="faq-subtitle">👥 User FAQs</h3>
          {faqs.users.map((faq, index) => (
            <FAQItem faq={faq} key={index} />
          ))}
        </div>
        <div className="faq-column">
          <h3 className="faq-subtitle">👨‍🍳 Chef FAQs</h3>
          {faqs.chefs.map((faq, index) => (
            <FAQItem faq={faq} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactFAQ;
