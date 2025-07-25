
// not using this file anymore

import React, { useState } from 'react';
import { acceptBooking, rejectBooking } from '../services/chefApi';
import ViewBookingDetails from './ViewBookingDetails';

const BookingCard = ({ booking }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [status, setStatus] = useState('');

  const handleAccept = async () => {
    const token = localStorage.getItem('token');
    const res = await acceptBooking(booking._id, token);
    if (res?.msg) setStatus('Accepted');
  };

  const handleReject = async () => {
    const token = localStorage.getItem('token');
    const res = await rejectBooking(booking._id, token);
    if (res?.msg) setStatus('Rejected');
  };

  return (
    <div style={{ border: '1px solid #ccc', margin: '10px', padding: '15px' }}>
      <p><strong>User:</strong> {booking.user?.name}</p>
      <p><strong>Date:</strong> {booking.date}</p>
      <p><strong>Status:</strong> {status || booking.status}</p>
      <button onClick={handleAccept}>Accept</button>
      <button onClick={handleReject}>Reject</button>
      <button onClick={() => setShowDetails(true)}>View More Details</button>

      {showDetails && (
        <ViewBookingDetails booking={booking} onClose={() => setShowDetails(false)} />
      )}
    </div>
  );
};


export default BookingCard;
