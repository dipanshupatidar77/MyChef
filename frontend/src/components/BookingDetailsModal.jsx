import React from 'react';
import './BookingDetailsModal.css'; //  This remains for styling

const BookingDetailsModal = ({ booking }) => {
  if (!booking) return null;

  return (
    <div className="booking-details-inline">
      <p><strong>User:</strong> {booking.userName}</p>
      <p><strong>Email:</strong> {booking.userEmail}</p>
      <p><strong>Phone:</strong> {booking.userPhone}</p>
      <p><strong>City:</strong> {booking.city}</p>
      <p><strong>Location:</strong> {booking.location}</p>
      <p><strong>Guests:</strong> {booking.numberOfGuests}</p>
      <p><strong>Event Date:</strong> {booking.eventDate}</p>
      <p><strong>Event Time:</strong> {booking.eventTime}</p>
      <p><strong>Dishes:</strong> {booking.selectedDishes?.join(', ')}</p>
      <p><strong>Contact Method:</strong> {booking.contactMethod}</p>
      <p><strong>Details:</strong> {booking.eventDetails}</p>
    </div>
  );
};

export default BookingDetailsModal;
