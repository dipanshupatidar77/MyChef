import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ChefDashboard.css';
import dashboardImage from '../assests/chef-dashboard.jpg';

const ChefDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="chef-dashboard">
      <h2>Welcome to Chef Dashboard</h2>
      <div className="dashboard-buttons">
        <button onClick={() => navigate('/chef/bookings/pending')}>Pending Booking Requests</button>
        <button onClick={() => navigate('/chef/bookings/upcoming')}>Upcoming Bookings</button>
        <button onClick={() => navigate('/chef/completed-bookings')}>Completed Bookings</button>
        <button disabled>View Ratings</button>
      </div>

      {/*  Bottom image */}
      <div className="dashboard-image">
        <img src={dashboardImage} alt="Chef working on dashboard" />
      </div>
    </div>
  );
};

export default ChefDashboard;
