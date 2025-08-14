
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserReviews.css';

const AcceptedFeedbacksSlider = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const res = await axios.get('/api/feedback/admin/feedbacks');
        const accepted = res.data.filter((fb) => fb.status === 'accepted');
        setReviews(accepted);
      } catch (err) {
        console.error('Failed to load reviews', err);
      }
    };

    getReviews();
  }, []);

  return (
    <section className="reviews-section">
      <h2 className="reviews-heading">💬 What Our Users Say</h2>
      <div className="reviews-slider">
        <div className="reviews-track">
          {reviews.map((rev) => (
            <div className="review-card" key={rev._id}>
              <p className="message">“{rev.message}”</p>
              <p className="name">– {rev.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AcceptedFeedbacksSlider;
