

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ChefProfile.css';
import BookingForm from '../components/BookingForm';
import { getChefReviews } from '../services/userApi'; // updated API

const ChefProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chef, setChef] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('userToken');
    return !!token;
  });

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Load chef & average rating
  useEffect(() => {
    const fetchChef = async () => {
      try {
        const res = await axios.get(`/api/chefs/${id}`);
        setChef(res.data);
      } catch (err) {
        console.error("❌ Error fetching chef profile:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchAvgRating = async () => {
      try {
        const res = await axios.get(`/api/chefs/${id}/reviews`);
        setAvgRating(res.data.avgRating || 0); // fallback
      } catch (error) {
        console.error('❌ Failed to fetch average rating:', error);
      }
    };

    fetchChef();
    fetchAvgRating();
  }, [id]);

  const handleBookNow = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      setShowBookingForm(true);
    }
  };

  const handleReadReviews = async () => {
  try {
    setLoadingReviews(true);
    const res = await getChefReviews(chef._id);

    if (!res || !res.data) {
      throw new Error('No data received from server');
    }

    const reviewsArray = Array.isArray(res.data.reviews) ? res.data.reviews : [];

    setReviews(reviewsArray);

    if (res.data.avgRating !== undefined) {
      setAvgRating(res.data.avgRating);
    }

    setShowReviews(true);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    alert('Failed to fetch reviews.');
  } finally {
    setLoadingReviews(false);
  }
};

  const renderStars = (rating) => {
    if (!rating) return '⭐⭐⭐⭐⭐';
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <>
        <span style={{ color: 'gold' }}>{'★'.repeat(fullStars)}</span>
        {halfStar && <span style={{ color: 'gold' }}>☆</span>}
        <span style={{ color: 'gray' }}>{'☆'.repeat(emptyStars)}</span>
      </>
    );
  };

  if (loading) return <p>Loading profile...</p>;
  if (!chef) return <p>Chef not found</p>;

  return (
    <div className="chef-profile-page-vertical">
      <div className="chef-profile-section">
        <img src={chef.profilePicUrl} alt={chef.name} className="profile-pic" />
        <h2>{chef.name}</h2>
        <p>Specialties: {chef.specialty?.join(', ')}</p>
        {chef.dishes?.length > 0 && (
          <p><strong>Dishes:</strong> {chef.dishes.join(', ')}</p>
        )}
        <p><strong>Experience:</strong> {chef.experience} years</p>
        <p><strong>City:</strong> {chef.city}</p>
        <p><strong>Service Time:</strong> {chef.serviceTime?.from} - {chef.serviceTime?.to}</p>
        <p><strong>Charge per visit:</strong> ₹{chef.chargesPerVisit}</p>

        {/* Average rating */}
        <p><strong>Rating:</strong> {renderStars(avgRating)} ({avgRating || '0'})</p>

       


        <button className="book-btn" onClick={handleBookNow}>BOOK NOW</button>
        <button className="read-review-btn" onClick={handleReadReviews}>📖 Read Reviews</button>
      </div>

      {showBookingForm && (
        <div className="booking-form-section">
          <BookingForm chefId={chef._id} chefName={chef.name} />
        </div>
      )}

      {showReviews && (
        <div className="review-modal">
          <h3>🗣️ What users say</h3>
          {loadingReviews ? (
  <p>Loading reviews...</p>
) : !Array.isArray(reviews) || reviews.length === 0 ? (
  <p>No reviews yet.</p>
) : (
  reviews.map((r, idx) => (
    <div key={idx} className="review-card">
      <h5>{r.userName}</h5>
      <p style={{ color: 'gold' }}>{'★'.repeat(r.review.rating)}</p>
      <p>{r.review.comment}</p>
    </div>
  ))
)}

          <button className="btn btn-danger" onClick={() => setShowReviews(false)} style={{ marginTop: '10px' }}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ChefProfile;
