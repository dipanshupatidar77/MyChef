import React, { useEffect, useState } from 'react';
import { getPendingBookings, updateBookingStatus } from '../services/chefApi'; //  Combined import
import BookingDetailsModal from '../components/BookingDetailsModal';
import './PendingBookings.css'; //  Custom CSS

const PendingBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getPendingBookings();
        setBookings(data || []);
      } catch (error) {
        console.error('Failed to fetch bookings', error);
      }
    };
    fetchBookings();
  }, []);

  const handleCardClick = (bookingId) => {
    setSelectedBookingId(prev => (prev === bookingId ? null : bookingId));
  };

  //  Accept Booking Logic
  const handleAccept = async (id) => {
    try {
      await updateBookingStatus(id, 'accepted'); //  Make sure string is lowercase
      alert('Booking accepted!');
      setBookings(bookings.filter(b => b._id !== id)); //  Remove it from list
    } catch (error) {
      console.error('Accept error:', error.response?.data || error.message);
      alert('Failed to accept booking.');
    }
  };

  //  Reject Booking Logic
  const handleReject = async (id) => {
    try {
      await updateBookingStatus(id, 'rejected'); // 🔴 Ensure lowercase
      alert('Booking rejected!');
      setBookings(bookings.filter(b => b._id !== id)); //  Remove it from list
    } catch (error) {
      console.error('Reject error:', error.response?.data || error.message);
      alert('Failed to reject booking.');
    }
  };

  return (
    <div className="pending-bookings-container">
      {bookings.length === 0 ? (
        <div className="no-bookings-message">
          <p style={{ textAlign: 'center', fontSize: '1.5rem', marginTop: '2rem' }}>
            🧑‍🍳⏳ No pending bookings right now!<br />
            Sit back, relax, and wait for your next event 🍽️✨
          </p>
        </div>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} className="booking-card">
            <div className="card-header">
              <div><strong>📅 {booking.eventDate}</strong></div>
              <div><strong>🏙️ {booking.city}</strong></div>
              <div><strong>📍 {booking.location}</strong></div>
            </div>

            <div className="card-actions">
              <button onClick={() => handleCardClick(booking._id)}>
                {selectedBookingId === booking._id ? 'Hide Details' : 'View Details'}
              </button>
              <button className="accept-btn" onClick={() => handleAccept(booking._id)}>Accept</button>
              <button className="reject-btn" onClick={() => handleReject(booking._id)}>Reject</button>
            </div>

            {selectedBookingId === booking._id && (
              <BookingDetailsModal booking={booking} />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PendingBookings;
