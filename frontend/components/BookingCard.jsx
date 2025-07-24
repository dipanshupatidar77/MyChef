import React, { useState } from 'react';
import './BookingCard.css';
import BookingDetailsModal from './BookingDetailsModal';
import { createOrder, updatePaymentStatus } from '../services/paymentApi';
import { submitReview, cancelBooking } from '../services/userApi';

const BookingCard = ({ booking }) => {
  const {
    chef,
    eventDate,
    eventTime,
    status,
    userName,
    userEmail,
    _id,
    exitConfirmed,
    review,
    cancelReason, // ✅ New field
  } = booking;

  const [showDetails, setShowDetails] = useState(false);
  const [localPaymentStatus, setLocalPaymentStatus] = useState(booking.paymentStatus);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cancellationStatus, setCancellationStatus] = useState(status === 'cancelled' ? 'cancelled' : '');
  const [cancellationMessage, setCancellationMessage] = useState('');

  const eventDateTime = new Date(`${eventDate}T${eventTime}`);
  const isPastBooking = eventDateTime < new Date();

  const formattedDate = new Date(eventDate).toLocaleDateString('en-IN');
  const formattedTime = new Date(`1970-01-01T${eventTime}`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const handlePayment = async () => {
  try {
    const amount = chef?.chargesPerVisit;
    const res = await createOrder(amount, _id);
    const { id: order_id, amount: orderAmount, currency } = res.data.order;

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: orderAmount,
      currency,
      name: 'MyChef Booking',
      description: 'Payment for chef booking',
      order_id,
      handler: async function (response) {
        alert('Payment successful ✅');

        //Send the transaction ID (razorpay_payment_id) to backend
        await updatePaymentStatus(_id, response.razorpay_payment_id);

        setLocalPaymentStatus('done');
      },
      prefill: {
        name: userName,
        email: userEmail,
      },
      theme: { color: '#3399cc' },
    };

    const razor = new window.Razorpay(options);
    razor.on('payment.failed', (res) => {
      alert('Payment failed.');
      console.error(res.error);
    });
    razor.open();
  } catch (error) {
    console.error('Payment Error:', error);
  }
};


  const handleSubmitReview = async () => {
    if (!rating || !comment.trim()) {
      alert('Please fill both rating and comment!');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('userToken');
      await submitReview(_id, rating, comment, token);
      alert('Review submitted! Thank you 😊');
      window.location.reload();
    } catch (err) {
      console.error('Review error:', err);
      alert('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelBooking = async () => {
    const confirm = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('userToken');
      await cancelBooking(_id, token);
      setCancellationStatus('cancelled');

      if (localPaymentStatus === 'done') {
        setCancellationMessage('Booking Cancelled. For refund-related queries, please contact the support team.');
      } else {
        setCancellationMessage('Booking Cancelled. Please book another chef.');
      }
    } catch (err) {
      console.error('Cancellation failed:', err);
      alert(err.response?.data?.msg || 'Error cancelling booking');
    }
  };

  return (
    <div className="booking-card">
      <h3>{chef?.name}</h3>
      <p><strong>City:</strong> {chef?.city}</p>
      <p><strong>Date:</strong> {formattedDate}</p>
      <p><strong>Time:</strong> {formattedTime}</p>
      <p>
        <strong>Status:</strong>
        <span style={{
          color: status === 'pending' ? 'orange' : status === 'accepted' ? 'green' : 'red',
          fontWeight: 'bold',
          marginLeft: '5px'
        }}>
          {status === 'cancelled' || cancellationStatus === 'cancelled' ? 'cancelled' : status}
        </span>
      </p>

      {status === 'accepted' && cancellationStatus !== 'cancelled' && (
        <p><strong>Payment Status:</strong>
          <span style={{ color: localPaymentStatus === 'done' ? 'green' : 'orange', marginLeft: '5px' }}>
            {localPaymentStatus === 'done' ? 'Done' : 'Pending'}
          </span>
        </p>
      )}

      <button
        className="btn btn-primary"
        onClick={() => setShowDetails(!showDetails)}
        style={{ marginTop: '10px' }}
      >
        {showDetails ? 'Hide Details' : 'View Details'}
      </button>

      {showDetails && <BookingDetailsModal booking={booking} />}

      {status === 'accepted' && !exitConfirmed && cancellationStatus !== 'cancelled' && (
        <div className="accepted-buttons">
          {localPaymentStatus !== 'done' && (
            <button className="btn btn-primary" onClick={handlePayment}>
              Make Payment
            </button>
          )}

          {localPaymentStatus === 'done' && (
            <>
              <button className="btn btn-success" disabled>
                Payment Done
              </button>
              <button className="btn btn-secondary" onClick={() => alert('Chat window coming Soon.')}>
                Chat with Chef
              </button>
            </>
          )}
        </div>
      )}

      {status !== 'cancelled' && cancellationStatus !== 'cancelled' && !isPastBooking && (
        <button
          className="btn btn-danger"
          style={{ marginTop: '10px' }}
          onClick={handleCancelBooking}
        >
          Cancel Booking
        </button>
      )}

      {/* Updated cancellation message block */}
      {(cancellationStatus === 'cancelled' || status === 'cancelled') && (
        <p style={{ marginTop: '10px', color: 'red', fontWeight: 'bold' }}>
          {cancelReason === 'chef_blocked'
            ? '❌ Booking cancelled because the chef was blocked. For more information, please contact support.'
            : cancellationMessage ||
              (localPaymentStatus === 'done'
                ? 'Booking Cancelled. For refund-related queries, please contact the support team.'
                : 'Booking Cancelled.')}
        </p>
      )}

      {exitConfirmed && (
        <div className="thank-you-section">
          <p style={{ marginTop: '15px', color: '#2e7d32', fontWeight: 'bold' }}>
            🎉 Thanks for trusting <span style={{ color: '#d32f2f' }}>MyChef</span>! We hope you had a delicious experience! 🍽️🙌
          </p>

          {!review ? (
            <div className="review-section" style={{ marginTop: '10px' }}>
              <h5 style={{ marginBottom: '5px' }}>Rate Your Chef:</h5>
              <select value={rating} onChange={(e) => setRating(e.target.value)}>
                <option value="">Select Rating</option>
                {[1, 2, 3, 4, 5].map((star) => (
                  <option key={star} value={star}>{star} ⭐</option>
                ))}
              </select>

              <textarea
                placeholder="Leave a review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="3"
                style={{ width: '100%', marginTop: '8px' }}
              ></textarea>

              <button
                className="btn btn-success"
                onClick={handleSubmitReview}
                disabled={submitting}
                style={{ marginTop: '8px' }}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          ) : (
            <div className="submitted-review" style={{ marginTop: '10px' }}>
              <p><strong>Your Rating:</strong> {review.rating} ⭐</p>
              <p><strong>Your Comment:</strong> "{review.comment}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingCard;
