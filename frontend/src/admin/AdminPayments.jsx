// import React, { useEffect, useState } from 'react';
// import { getAllPayments } from '../services/adminApi';
// import '../styles/AdminPayments.css';
// import Swal from 'sweetalert2';

// const AdminPayments = () => {
//   const [payments, setPayments] = useState(null);
//   const [selectedPayment, setSelectedPayment] = useState(null);

//   useEffect(() => {
//     const fetchPayments = async () => {
//       try {
//         const data = await getAllPayments();
//         // Handle if it's wrapped as { payments: [...] }
//         if (Array.isArray(data.payments)) {
//           setPayments(data.payments);
//         } else if (Array.isArray(data)) {
//           setPayments(data);
//         } else {
//           setPayments([]); // fallback
//         }
//       } catch (err) {
//         console.error('Failed to load payments:', err);
//         Swal.fire('Error', err.response?.data?.msg || 'Something went wrong', 'error');
//       }
//     };

//     fetchPayments();
//   }, []);

//   const handleViewDetails = (payment) => {
//     setSelectedPayment(payment);
//   };

//   const closeModal = () => {
//     setSelectedPayment(null);
//   };

//   if (payments === null) return <p>Loading payments...</p>;

//   return (
//     <div className="admin-payments">
//       <h2>All Payments</h2>
//       {payments.length === 0 ? (
//         <p>No payments found.</p>
//       ) : (
//         payments.map((payment) => (
//           <div key={payment._id} className="payment-card">
//             <h4>User: {payment.user?.name || 'N/A'}</h4>
//             <p>
//               Payment Date:{' '}
//               {payment.paymentDate
//                 ? new Date(payment.paymentDate).toLocaleString()
//                 : 'Not Available'}
//             </p>
//             <button onClick={() => handleViewDetails(payment)} className="view-btn">
//               View Details
//             </button>
//           </div>
//         ))
//       )}

//       {selectedPayment && (
//         <div className="payment-modal">
//           <div className="modal-content">
//             <h3>Payment Details</h3>
//             <p><strong>Chef:</strong> {selectedPayment.chef?.name || 'N/A'}</p>
//             <p><strong>Booking Date:</strong> {new Date(selectedPayment.eventDate).toLocaleDateString()}</p>
//             <p><strong>Amount:</strong> ₹{selectedPayment.chef?.chargesPerVisit || 'N/A'}</p>
//             <p><strong>Transaction ID:</strong> {selectedPayment.transactionId || 'Not Available'}</p>
//             <p><strong>Payment Date:</strong> {selectedPayment.paymentDate
//               ? new Date(selectedPayment.paymentDate).toLocaleString()
//               : 'Not Available'}</p>
//             <button onClick={closeModal} className="close-btn">Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminPayments;


import React, { useEffect, useState } from 'react';
import { getAllPayments } from '../services/adminApi';
import '../styles/AdminPayments.css';
import Swal from 'sweetalert2';

const AdminPayments = () => {
  const [payments, setPayments] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getAllPayments();
        if (Array.isArray(data.payments)) {
          setPayments(data.payments);
        } else if (Array.isArray(data)) {
          setPayments(data);
        } else {
          setPayments([]);
        }
      } catch (err) {
        console.error('Failed to load payments:', err);
        Swal.fire('Error', err.response?.data?.msg || 'Something went wrong', 'error');
      }
    };

    fetchPayments();
  }, []);

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
  };

  const closeModal = () => {
    setSelectedPayment(null);
  };

  const groupPaymentsByDate = (payments) => {
    const groups = {};
    payments.forEach((payment) => {
      const date = payment.paymentDate
        ? new Date(payment.paymentDate).toLocaleDateString('en-GB')
        : 'Unknown';
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(payment);
    });

    // Sort dates descending
    return Object.entries(groups).sort(
      ([dateA], [dateB]) => new Date(dateB) - new Date(dateA)
    );
  };

  if (payments === null) return <p>Loading payments...</p>;

  const groupedPayments = groupPaymentsByDate(payments);

  return (
    <div className="admin-payments">
      <h2>All Payments</h2>
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        groupedPayments.map(([date, group]) => (
          <div key={date}>
            <h3 className="payment-group-heading">Payments on {date}</h3>
            {group.map((payment) => (
              <div key={payment._id} className="payment-card">
                <h4>User: {payment.user?.name || 'N/A'}</h4>
                <p>
                  Payment Date:{' '}
                  {payment.paymentDate
                    ? new Date(payment.paymentDate).toLocaleString()
                    : 'Not Available'}
                </p>
                <button onClick={() => handleViewDetails(payment)} className="view-btn">
                  View Details
                </button>
              </div>
            ))}
            <hr className="payment-divider" />
          </div>
        ))
      )}

      {selectedPayment && (
        <div className="payment-modal">
          <div className="modal-content">
            <h3>Payment Details</h3>
            <p><strong>Chef:</strong> <span>{selectedPayment.chef?.name || 'N/A'}</span></p>
<p><strong>Booking Date:</strong> <span>{new Date(selectedPayment.eventDate).toLocaleDateString()}</span></p>
<p><strong>Amount:</strong> <span>₹{selectedPayment.chef?.chargesPerVisit || 'N/A'}</span></p>
<p><strong>Transaction ID:</strong> <span>{selectedPayment.transactionId || 'Not Available'}</span></p>
<p><strong>Payment Date:</strong> <span>{selectedPayment.paymentDate
  ? new Date(selectedPayment.paymentDate).toLocaleString()
  : 'Not Available'}</span></p>
            <button onClick={closeModal} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
