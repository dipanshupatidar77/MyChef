import React from 'react';
import { Link } from 'react-router-dom';
import './ChefCard.css';

const ChefCard = ({ chef }) => {
  return (
    <div className="chef-card">
      <img src={chef.profilePicUrl} alt={chef.name} className="chef-image" />
      <div className="chef-details">
        <h3>{chef.name}</h3>
        <p className="chef-info">👨‍🍳 {chef.experience} years experience</p>
        <p className="chef-info">📍 Based in {chef.city}</p>
        
        <Link to={`/chef/${chef._id}`}>
          <button className="view-profile-btn">View Profile</button>
        </Link>
      </div>
    </div>
  );
};

export default ChefCard;
