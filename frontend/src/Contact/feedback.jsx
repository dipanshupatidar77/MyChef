import React, { useState } from 'react';
import './contact.css';
import axios from 'axios';
const ContactFeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/feedback/submit', formData);
      alert(res.data.msg || 'Feedback sent successfully!');
      setFormData({ name: '', email: '', message: '' }); // Reset form
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="feedback-section">
      <div className="feedback-container">
        <h2>🥘 Share Your <span className="highlight">MyChef</span> Experience</h2>
        <p>We’d love to hear from you! Your feedback helps us serve better.</p>

        <form className="feedback-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <textarea
            name="message"
            rows="5"
            placeholder="Tell us about your experience..."
            required
            value={formData.message}
            onChange={handleChange}
          ></textarea>

          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Feedback'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactFeedbackForm;
