import React from 'react';

const ViewBookingDetails = ({ booking, onClose }) => {
  return (
    <div style={{ background: '#fff', padding: 20, border: '1px solid black' }}>
      <h3>Booking Details</h3>
      <p><strong>User Name:</strong> {booking.user?.name}</p>
      <p><strong>Email:</strong> {booking.user?.email}</p>
      <p><strong>Date:</strong> {booking.date}</p>
      <p><strong>Time:</strong> {booking.time}</p>
      <p><strong>Location:</strong> {booking.location}</p>
      <p><strong>Persons:</strong> {booking.numberOfPersons}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ViewBookingDetails;
