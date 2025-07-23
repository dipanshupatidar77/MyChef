// import React, { useEffect, useState } from 'react';
// import { getUserBookings } from '../services/userApi';
// import BookingCard from '../components/BookingCard';


// const MyBookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const token = localStorage.getItem('userToken'); // or from context
//         const res = await getUserBookings(token);
//         setBookings(res.data);
//       } catch (error) {
//         console.error('Error fetching bookings:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, []);

//   return (
//     <div className="container">
//       <h2>My Bookings</h2>
//       {loading ? (
//         <p>Loading...</p>
//       ) : bookings.length === 0 ? (
//         <p>No bookings found.</p>
//       ) : (
//         bookings.map((booking) => (
//           <BookingCard key={booking._id} booking={booking} />
//         ))
//       )}
//     </div>
//   );
// };


// export default MyBookings;


import React, { useEffect, useState } from 'react';
import { getUserBookings } from '../services/userApi';
import BookingCard from '../components/BookingCard';

const MyBookings = () => {
  const [activeBookings, setActiveBookings] = useState([]);
  const [otherBookings, setOtherBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const res = await getUserBookings(token);
        const allBookings = res.data;
        const now = new Date();

        const upcoming = [];
        const others = [];

        allBookings.forEach((booking) => {
          const eventDateTime = new Date(`${booking.eventDate}T${booking.eventTime}`);

          // Completed
          if (booking.exitConfirmed) {
            const exitTime = new Date(booking.exitConfirmed);
            const hoursSinceExit = (now - exitTime) / (1000 * 60 * 60);
            if (hoursSinceExit < 72) others.push(booking);
            return;
          }

          // Cancelled
          if (
            booking.status === 'cancelled' ||
            booking.cancellationStatus === 'cancelled'
          ) {
            const cancelTime = new Date(booking.cancelledAt || booking.updatedAt);
            const hoursSinceCancel = (now - cancelTime) / (1000 * 60 * 60);
            if (hoursSinceCancel < 72) others.push(booking);
            return;
          }

          // Active: pending or accepted
          upcoming.push(booking);
        });

        // Sort both groups by eventDateTime
        const sortByDateTime = (a, b) =>
          new Date(`${a.eventDate}T${a.eventTime}`) -
          new Date(`${b.eventDate}T${b.eventTime}`);

        upcoming.sort(sortByDateTime);
        others.sort(sortByDateTime);

        setActiveBookings(upcoming);
        setOtherBookings(others);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="container">
      <h2>My Bookings</h2>

      {loading ? (
        <p>Loading...</p>
      ) : activeBookings.length + otherBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <>
          {activeBookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))}

          {otherBookings.length > 0 && (
            <>
              <hr style={{ margin: '30px 0', borderTop: '2px solid #ccc' }} />
              <h4 style={{ textAlign: 'center', color: '#888' }}>Past / Cancelled Bookings</h4>
              {otherBookings.map((booking) => (
                <BookingCard key={booking._id} booking={booking} />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MyBookings;
