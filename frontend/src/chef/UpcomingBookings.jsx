// import React, { useEffect, useState } from 'react';
// import { getUpcomingBookings } from '../services/chefApi';
// import ChefUpcomingBookingCard from '../components/ChefUpcomingBookingCard'; // ✅ Use chef-specific card

// const UpcomingBookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const token = localStorage.getItem('chefToken');
//         const res = await getUpcomingBookings(token);

//         // ✅ Filter for accepted and cancelled only
//         const filtered = res.data.filter(
//           (b) => b.status === 'accepted' || b.status === 'cancelled'
//         );

//         // ✅ Sort: accepted first, then cancelled
//         const sorted = filtered.sort((a, b) => {
//           if (a.status === 'cancelled' && b.status !== 'cancelled') return 1;
//           if (b.status === 'cancelled' && a.status !== 'cancelled') return -1;
//           return new Date(a.eventDate) - new Date(b.eventDate);
//         });

//         setBookings(sorted);
//       } catch (err) {
//         console.error('Error fetching upcoming bookings:', err);
//         setError('Failed to fetch bookings. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, []);

//   return (
//     <div className="container">
//       <h2>Upcoming Bookings</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p style={{ color: 'red' }}>{error}</p>
//       ) : bookings.length === 0 ? (
//         <p>No upcoming bookings.</p>
//       ) : (
//         bookings.map((booking) => (
//           <ChefUpcomingBookingCard key={booking._id} booking={booking} />
//         ))
//       )}
//     </div>
//   );
// };

// export default UpcomingBookings;




import React, { useEffect, useState } from 'react';
import { getUpcomingBookings } from '../services/chefApi';
import ChefUpcomingBookingCard from '../components/ChefUpcomingBookingCard';

const UpcomingBookings = () => {
  const [acceptedBookings, setAcceptedBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('chefToken');
        const res = await getUpcomingBookings(token);

        const now = new Date();
        const accepted = [];
        const cancelled = [];
        const completed = [];

        res.data.forEach((booking) => {
          if (booking.exitConfirmed) {
            // ✅ Mark as completed
            booking.status = 'completed';
            completed.push(booking);
          } else if (booking.status === 'accepted') {
            accepted.push(booking);
          } else if (booking.status === 'cancelled') {
            const cancelledAt = new Date(booking.cancelledAt || booking.updatedAt);
            const hoursSinceCancel = (now - cancelledAt) / (1000 * 60 * 60);
            if (hoursSinceCancel < 72) {
              cancelled.push(booking);
            }
          }
        });

        // Sort all by date + time
        const sortByDateTime = (a, b) =>
          new Date(`${a.eventDate}T${a.eventTime}`) - new Date(`${b.eventDate}T${b.eventTime}`);

        setAcceptedBookings(accepted.sort(sortByDateTime));
        setCancelledBookings(cancelled.sort(sortByDateTime));
        setCompletedBookings(completed.sort(sortByDateTime));
      } catch (err) {
        console.error('Error fetching upcoming bookings:', err);
        setError('Failed to fetch bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="container">
      <h2>Upcoming Bookings</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : acceptedBookings.length + cancelledBookings.length + completedBookings.length === 0 ? (
        <p>No upcoming bookings.</p>
      ) : (
        <>
          {acceptedBookings.map((booking) => (
            <ChefUpcomingBookingCard key={booking._id} booking={booking} />
          ))}

          {completedBookings.length > 0 && (
            <>
              <hr style={{ margin: '30px 0', borderTop: '2px solid #4caf50' }} />
              <h4 style={{ textAlign: 'center', color: '#4caf50' }}>Completed Bookings</h4>
              {completedBookings.map((booking) => (
                <ChefUpcomingBookingCard key={booking._id} booking={booking} />
              ))}
            </>
          )}

          {cancelledBookings.length > 0 && (
            <>
              <hr style={{ margin: '30px 0', borderTop: '2px solid #ccc' }} />
              <h4 style={{ textAlign: 'center', color: '#888' }}>Cancelled Bookings</h4>
              {cancelledBookings.map((booking) => (
                <ChefUpcomingBookingCard key={booking._id} booking={booking} />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UpcomingBookings;






// import React, { useEffect, useState } from 'react';
// import { getUpcomingBookings } from '../services/chefApi';
// import ChefUpcomingBookingCard from '../components/ChefUpcomingBookingCard';

// const UpcomingBookings = () => {
//   const [acceptedBookings, setAcceptedBookings] = useState([]);
//   const [cancelledBookings, setCancelledBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const token = localStorage.getItem('chefToken');
//         const res = await getUpcomingBookings(token);
//         const now = new Date();

//         const accepted = [];
//         const cancelled = [];

//         res.data.forEach((booking) => {
//           if (booking.status === 'accepted') {
//             accepted.push(booking);
//           } else if (booking.status === 'cancelled') {
//             const cancelledAt = new Date(booking.cancelledAt || booking.updatedAt);
//             const hoursSinceCancel = (now - cancelledAt) / (1000 * 60 * 60);
//             if (hoursSinceCancel < 72) {
//               cancelled.push(booking);
//             }
//           }
//         });

//         // Sort both groups by date+time
//         const sortByDateTime = (a, b) =>
//           new Date(`${a.eventDate}T${a.eventTime}`) -
//           new Date(`${b.eventDate}T${b.eventTime}`);

//         setAcceptedBookings(accepted.sort(sortByDateTime));
//         setCancelledBookings(cancelled.sort(sortByDateTime));
//       } catch (err) {
//         console.error('Error fetching upcoming bookings:', err);
//         setError('Failed to fetch bookings. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, []);

//   return (
//     <div className="container">
//       <h2>Upcoming Bookings</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p style={{ color: 'red' }}>{error}</p>
//       ) : acceptedBookings.length + cancelledBookings.length === 0 ? (
//         <p>No upcoming bookings.</p>
//       ) : (
//         <>
//           {acceptedBookings.map((booking) => (
//             <ChefUpcomingBookingCard key={booking._id} booking={booking} />
//           ))}

//           {cancelledBookings.length > 0 && (
//             <>
//               <hr style={{ margin: '30px 0', borderTop: '2px solid #ccc' }} />
//               <h4 style={{ textAlign: 'center', color: '#888' }}>Cancelled Bookings</h4>
//               {cancelledBookings.map((booking) => (
//                 <ChefUpcomingBookingCard key={booking._id} booking={booking} />
//               ))}
//             </>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default UpcomingBookings;
