import React, { useEffect, useState } from 'react';
import { getCompletedBookings } from '../services/chefApi';
import ChefUpcomingBookingCard from '../components/ChefUpcomingBookingCard'; // reuse same card

const ChefCompletedBookings = () => {
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const token = localStorage.getItem('chefToken');
        const res = await getCompletedBookings(token);
        setCompleted(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch completed bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchCompleted();
  }, []);

  return (
    <div className="container">
      <h2>Completed Bookings</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : completed.length === 0 ? (
        <p>No completed bookings.</p>
      ) : (
        completed.map((booking) => (
          <ChefUpcomingBookingCard key={booking._id} booking={booking} />
        ))
      )}
    </div>
  );
};

export default ChefCompletedBookings;
