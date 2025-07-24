import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ChefBookingCard.css';

const ChefBookingCard = ({ chef }) => {
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate(`/book-chef/booking/${chef._id}`);
  };

  return (
    <div className="chef-booking-card">
      <img src={chef.profilePicUrl} alt={chef.name} className="chef-image" />
      <div className="chef-info">
        <h3>{chef.name}</h3>
        <p>Experience: {chef.experience} years</p>
        <p>City: {chef.city}</p>
        <button onClick={handleBooking} className="book-now-btn">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default ChefBookingCard;
