import React from 'react';
import { useParams } from 'react-router-dom';
import BookingForm from '../components/BookingForm';

const BookingPage = () => {
  const { chefId } = useParams();
  return (
    <div className="booking-page-container">
      <BookingForm chefId={chefId} />
    </div>
  );
};

export default BookingPage;

// not using now 