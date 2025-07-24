
// import React, { useState } from 'react';
// import BookingDetailsModal from './BookingDetailsModal';
// import './BookingCard.css';
// import {
//   sendEntryOtp,
//   verifyEntryOtp,
//   sendExitOtp,
//   verifyExitOtp,
//   cancelBookingByChef
// } from '../services/chefApi';

// const ChefUpcomingBookingCard = ({ booking }) => {
//   const { user, eventDate, eventTime, status, userName, paymentStatus } = booking;

//   const [showDetails, setShowDetails] = useState(false);
//   const [loadingOtp, setLoadingOtp] = useState(false);
//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [enteredOtp, setEnteredOtp] = useState('');
//   const [verifying, setVerifying] = useState(false);
//   const [showExitOtpModal, setShowExitOtpModal] = useState(false);
//   const [exitOtp, setExitOtp] = useState('');
//   const [verifyingExit, setVerifyingExit] = useState(false);
//   const [exitConfirmed, setExitConfirmed] = useState(booking.exitConfirmed || false);

//   const [cancelled, setCancelled] = useState(status === 'cancelled');
//   const [cancellationMsg, setCancellationMsg] = useState('');

//   const handleEntryOtpClick = async () => {
//     const confirm = window.confirm('Are you sure you want to send the entry time OTP to the user?');
//     if (!confirm) return;

//     setLoadingOtp(true);
//     try {
//       const token = localStorage.getItem('chefToken');
//       const res = await sendEntryOtp(booking._id, token);
//       alert(res.data.msg || 'OTP sent to user!');
//       setShowOtpModal(true);
//     } catch (err) {
//       console.error(err);
//       alert('Failed to send OTP');
//     } finally {
//       setLoadingOtp(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (!enteredOtp.trim()) {
//       alert('Please enter the OTP');
//       return;
//     }

//     setVerifying(true);
//     try {
//       const token = localStorage.getItem('chefToken');
//       const res = await verifyEntryOtp(booking._id, enteredOtp, token);
//       alert(res.data.msg || 'OTP Verified!');
//       setShowOtpModal(false);
//     } catch (err) {
//       console.error(err);
//       alert('Invalid OTP or verification failed.');
//     } finally {
//       setVerifying(false);
//     }
//   };

//   const handleExitOtpClick = async () => {
//     const confirm = window.confirm('Are you sure you want to send the exit time OTP to the user?');
//     if (!confirm) return;

//     setLoadingOtp(true);
//     try {
//       const token = localStorage.getItem('chefToken');
//       const res = await sendExitOtp(booking._id, token);
//       alert(res.data.msg || 'Exit OTP sent to user!');
//       setShowExitOtpModal(true);
//     } catch (err) {
//       console.error(err);
//       alert('Failed to send Exit OTP');
//     } finally {
//       setLoadingOtp(false);
//     }
//   };

//   const handleVerifyExitOtp = async () => {
//     if (!exitOtp.trim()) {
//       alert('Please enter the OTP');
//       return;
//     }

//     setVerifyingExit(true);
//     try {
//       const token = localStorage.getItem('chefToken');
//       const res = await verifyExitOtp(booking._id, exitOtp, token);
//       alert(res.data.msg || 'Exit OTP Verified!');
//       setExitConfirmed(true);
//       setShowExitOtpModal(false);
//     } catch (err) {
//       console.error(err);
//       alert('Invalid OTP or verification failed.');
//     } finally {
//       setVerifyingExit(false);
//     }
//   };

//   const handleCancelByChef = async () => {
//     const confirm = window.confirm('Are you sure you want to cancel this booking?');
//     if (!confirm) return;

//     try {
//       const token = localStorage.getItem('chefToken');
//       const res = await cancelBookingByChef(booking._id, token);

//       setCancelled(true);
//       setCancellationMsg(
//         'Booking cancelled. You have only 2 free cancellations allowed per month. After that, charges will be deducted by the company.'
//       );
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.msg || 'Error cancelling booking');
//     }
//   };

//   return (
//     <div className="booking-card">
//       <h3>{user?.name || userName}</h3>

//       <p><strong>Date:</strong> {new Date(eventDate).toLocaleDateString('en-IN')}</p>
//       <p><strong>Time:</strong> {new Date(`1970-01-01T${eventTime}`).toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true
//       })}</p>

//       <p>
//         <strong>Status:</strong>{' '}
//         <span style={{
//           color: cancelled ? 'red' : status === 'pending' ? 'orange' : 'green',
//           fontWeight: 'bold'
//         }}>
//           {cancelled ? 'cancelled' : status}
//         </span>
//       </p>

//       {paymentStatus === 'done' && (
//         <p><strong>Payment:</strong> Done ✅</p>
//       )}

//       {/* Show cancel button only if not already cancelled */}
//       {!cancelled && (
//         <button
//           className="btn btn-danger"
//           style={{ marginTop: '10px' }}
//           onClick={handleCancelByChef}
//         >
//           Cancel Booking
//         </button>
//       )}

//       {/* Show correct cancellation message */}
//       {cancelled && (
//         <p style={{ color: 'red', fontWeight: 'bold', marginTop: '10px' }}>
//           {cancellationMsg ||
//             (booking.cancelledBy === 'user'
//               ? 'Booking cancelled by user.'
//               : 'Booking cancelled by chef.')}
//         </p>
//       )}

//       {/* Entry / Exit OTP */}
//       {paymentStatus === 'done' && !cancelled && !exitConfirmed && (
//         <div style={{ marginTop: '10px' }}>
//           <button
//             className="btn btn-secondary"
//             style={{ marginRight: '10px' }}
//             onClick={handleEntryOtpClick}
//             disabled={loadingOtp}
//           >
//             {loadingOtp ? 'Sending...' : 'Entry OTP'}
//           </button>
//           <button
//             className="btn btn-secondary"
//             onClick={handleExitOtpClick}
//             disabled={loadingOtp}
//           >
//             {loadingOtp ? 'Sending...' : 'Exit OTP'}
//           </button>
//         </div>
//       )}

//       <button
//         className="btn btn-primary"
//         onClick={() => setShowDetails(!showDetails)}
//         style={{ marginTop: '10px' }}
//       >
//         {showDetails ? 'Hide Details' : 'View Details'}
//       </button>

//       {showDetails && <BookingDetailsModal booking={booking} />}

//       {/* Entry OTP Modal */}
//       {showOtpModal && (
//         <div className="otp-modal-overlay">
//           <div className="otp-modal">
//             <h4>Enter Entry OTP received by the user</h4>
//             <input
//               type="text"
//               value={enteredOtp}
//               onChange={(e) => setEnteredOtp(e.target.value)}
//               placeholder="Enter 4-digit OTP"
//             />
//             <div style={{ marginTop: '10px' }}>
//               <button className="btn btn-success" onClick={handleVerifyOtp} disabled={verifying}>
//                 {verifying ? 'Verifying...' : 'Verify OTP'}
//               </button>
//               <button className="btn btn-danger" onClick={() => setShowOtpModal(false)} style={{ marginLeft: '10px' }}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Exit OTP Modal */}
//       {showExitOtpModal && (
//         <div className="otp-modal-overlay">
//           <div className="otp-modal">
//             <h4>Enter Exit OTP received by the user</h4>
//             <input
//               type="text"
//               value={exitOtp}
//               onChange={(e) => setExitOtp(e.target.value)}
//               placeholder="Enter 4-digit OTP"
//             />
//             <div style={{ marginTop: '10px' }}>
//               <button className="btn btn-success" onClick={handleVerifyExitOtp} disabled={verifyingExit}>
//                 {verifyingExit ? 'Verifying...' : 'Verify OTP'}
//               </button>
//               <button className="btn btn-danger" onClick={() => setShowExitOtpModal(false)} style={{ marginLeft: '10px' }}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChefUpcomingBookingCard;


import React, { useState } from 'react';
import BookingDetailsModal from './BookingDetailsModal';
import './BookingCard.css';
import {
  sendEntryOtp,
  verifyEntryOtp,
  sendExitOtp,
  verifyExitOtp,
  cancelBookingByChef
} from '../services/chefApi';

const ChefUpcomingBookingCard = ({ booking, isCompletedView = false }) => {
  const { user, eventDate, eventTime, status, userName, paymentStatus } = booking;

  const [showDetails, setShowDetails] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [showExitOtpModal, setShowExitOtpModal] = useState(false);
  const [exitOtp, setExitOtp] = useState('');
  const [verifyingExit, setVerifyingExit] = useState(false);
  const [exitConfirmed, setExitConfirmed] = useState(booking.exitConfirmed || false);

  const [cancelled, setCancelled] = useState(status === 'cancelled');
  const [cancellationMsg, setCancellationMsg] = useState('');

  const handleEntryOtpClick = async () => {
    const confirm = window.confirm('Are you sure you want to send the entry time OTP to the user?');
    if (!confirm) return;

    setLoadingOtp(true);
    try {
      const token = localStorage.getItem('chefToken');
      const res = await sendEntryOtp(booking._id, token);
      alert(res.data.msg || 'OTP sent to user!');
      setShowOtpModal(true);
    } catch (err) {
      console.error(err);
      alert('Failed to send OTP');
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!enteredOtp.trim()) {
      alert('Please enter the OTP');
      return;
    }

    setVerifying(true);
    try {
      const token = localStorage.getItem('chefToken');
      const res = await verifyEntryOtp(booking._id, enteredOtp, token);
      alert(res.data.msg || 'OTP Verified!');
      setShowOtpModal(false);
    } catch (err) {
      console.error(err);
      alert('Invalid OTP or verification failed.');
    } finally {
      setVerifying(false);
    }
  };

  const handleExitOtpClick = async () => {
    const confirm = window.confirm('Are you sure you want to send the exit time OTP to the user?');
    if (!confirm) return;

    setLoadingOtp(true);
    try {
      const token = localStorage.getItem('chefToken');
      const res = await sendExitOtp(booking._id, token);
      alert(res.data.msg || 'Exit OTP sent to user!');
      setShowExitOtpModal(true);
    } catch (err) {
      console.error(err);
      alert('Failed to send Exit OTP');
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleVerifyExitOtp = async () => {
    if (!exitOtp.trim()) {
      alert('Please enter the OTP');
      return;
    }

    setVerifyingExit(true);
    try {
      const token = localStorage.getItem('chefToken');
      const res = await verifyExitOtp(booking._id, exitOtp, token);
      alert(res.data.msg || 'Exit OTP Verified!');
      setExitConfirmed(true);
      setShowExitOtpModal(false);
    } catch (err) {
      console.error(err);
      alert('Invalid OTP or verification failed.');
    } finally {
      setVerifyingExit(false);
    }
  };

  const handleCancelByChef = async () => {
    const confirm = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('chefToken');
      const res = await cancelBookingByChef(booking._id, token);

      setCancelled(true);
      setCancellationMsg(
        'Booking cancelled. You have only 2 free cancellations allowed per month. After that, charges will be deducted by the company.'
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Error cancelling booking');
    }
  };

  return (
    <div className="booking-card">
      <h3>{user?.name || userName}</h3>

      <p><strong>Date:</strong> {new Date(eventDate).toLocaleDateString('en-IN')}</p>
      <p><strong>Time:</strong> {new Date(`1970-01-01T${eventTime}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })}</p>

      <p>
        <strong>Status:</strong>{' '}
        <span style={{
          color: cancelled ? 'red' : status === 'pending' ? 'orange' : 'green',
          fontWeight: 'bold'
        }}>
          {cancelled ? 'cancelled' : status}
        </span>
      </p>

      {paymentStatus === 'done' && (
        <p><strong>Payment:</strong> Done ✅</p>
      )}

      {/* ✅ Hide cancel button if completed or from completed section */}
      {!cancelled && status !== 'completed' && !isCompletedView && (
        <button
          className="btn btn-danger"
          style={{ marginTop: '10px' }}
          onClick={handleCancelByChef}
        >
          Cancel Booking
        </button>
      )}

      {/* Show correct cancellation message */}
      {cancelled && (
        <p style={{ color: 'red', fontWeight: 'bold', marginTop: '10px' }}>
          {cancellationMsg ||
            (booking.cancelledBy === 'user'
              ? 'Booking cancelled by user.'
              : 'Booking cancelled by chef.')}
        </p>
      )}

      {/* Entry / Exit OTP */}
      {paymentStatus === 'done' && !cancelled && !exitConfirmed && !isCompletedView && (
        <div style={{ marginTop: '10px' }}>
          <button
            className="btn btn-secondary"
            style={{ marginRight: '10px' }}
            onClick={handleEntryOtpClick}
            disabled={loadingOtp}
          >
            {loadingOtp ? 'Sending...' : 'Entry OTP'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleExitOtpClick}
            disabled={loadingOtp}
          >
            {loadingOtp ? 'Sending...' : 'Exit OTP'}
          </button>
        </div>
      )}

      <button
        className="btn btn-primary"
        onClick={() => setShowDetails(!showDetails)}
        style={{ marginTop: '10px' }}
      >
        {showDetails ? 'Hide Details' : 'View Details'}
      </button>

      {showDetails && <BookingDetailsModal booking={booking} />}

      {/* Entry OTP Modal */}
      {showOtpModal && (
        <div className="otp-modal-overlay">
          <div className="otp-modal">
            <h4>Enter Entry OTP received by the user</h4>
            <input
              type="text"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              placeholder="Enter 4-digit OTP"
            />
            <div style={{ marginTop: '10px' }}>
              <button className="btn btn-success" onClick={handleVerifyOtp} disabled={verifying}>
                {verifying ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button className="btn btn-danger" onClick={() => setShowOtpModal(false)} style={{ marginLeft: '10px' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit OTP Modal */}
      {showExitOtpModal && (
        <div className="otp-modal-overlay">
          <div className="otp-modal">
            <h4>Enter Exit OTP received by the user</h4>
            <input
              type="text"
              value={exitOtp}
              onChange={(e) => setExitOtp(e.target.value)}
              placeholder="Enter 4-digit OTP"
            />
            <div style={{ marginTop: '10px' }}>
              <button className="btn btn-success" onClick={handleVerifyExitOtp} disabled={verifyingExit}>
                {verifyingExit ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button className="btn btn-danger" onClick={() => setShowExitOtpModal(false)} style={{ marginLeft: '10px' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChefUpcomingBookingCard;
