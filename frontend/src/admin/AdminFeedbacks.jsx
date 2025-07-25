// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import '../styles/AdminFeedbacks.css';

// const AdminFeedbacks = () => {
//   const [feedbacks, setFeedbacks] = useState([]);

//   // ✅ Fetch all feedbacks
//   const fetchFeedbacks = async () => {
//     try {
//       const res = await axios.get('/api/feedback/admin/feedbacks');
//       setFeedbacks(res.data); // ✅ No .feedbacks — backend returns full array
//     } catch (error) {
//       console.error('Failed to fetch feedbacks', error);
//       Swal.fire('Error', 'Could not load feedbacks', 'error');
//     }
//   };

//   useEffect(() => {
//     fetchFeedbacks();
//   }, []);

//   // ✅ Accept/Reject handler
//   const handleStatusChange = async (id, status) => {
//     try {
//       const res = await axios.put(`/api/feedback/${id}/status`, { status });
//       Swal.fire('Success', `Feedback ${status}`, 'success');
//       fetchFeedbacks(); // Refresh after update
//     } catch (err) {
//       console.error(err);
//       Swal.fire('Error', 'Could not update status', 'error');
//     }
//   };

//   return (
//     <div className="admin-feedbacks">
//       <h2>User Feedbacks</h2>
//       {feedbacks.length === 0 ? (
//         <p>No feedbacks found.</p>
//       ) : (
//         feedbacks.map((fb) => (
//           <div key={fb._id} className="feedback-card">
//             <h4>{fb.name}</h4>
//             <p><strong>Email:</strong> {fb.email}</p>
//             <p><strong>Message:</strong> {fb.message}</p>
//             <p><strong>Status:</strong> {fb.status}</p>
//             <div className="btn-group">
//               <button
//                 className="accept-btn"
//                 disabled={fb.status === 'accepted'}
//                 onClick={() => handleStatusChange(fb._id, 'accepted')}
//               >
//                 Accept
//               </button>
//               <button
//                 className="reject-btn"
//                 disabled={fb.status === 'rejected'}
//                 onClick={() => handleStatusChange(fb._id, 'rejected')}
//               >
//                 Reject
//               </button>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default AdminFeedbacks;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../styles/AdminFeedbacks.css';

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get('/api/feedback/admin/feedbacks');
      setFeedbacks(res.data);
    } catch (error) {
      console.error('Failed to fetch feedbacks', error);
      Swal.fire('Error', 'Could not load feedbacks', 'error');
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleAccept = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to accept this feedback?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, accept it!',
      cancelButtonText: 'Cancel',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.put(`/api/feedback/${id}/status`, { status: 'accepted' });
        Swal.fire('Accepted!', 'Feedback has been accepted.', 'success');
        fetchFeedbacks();
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Could not accept feedback', 'error');
      }
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`/api/feedback/${id}/status`, { status: 'rejected' });
      Swal.fire('Rejected!', 'Feedback has been removed.', 'success');
      setFeedbacks((prev) => prev.filter((fb) => fb._id !== id)); // Remove from UI
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Could not reject feedback', 'error');
    }
  };

  return (
    <div className="admin-feedbacks">
      <h2>User Feedbacks</h2>
      {feedbacks.length === 0 ? (
        <p>No feedbacks found.</p>
      ) : (
        feedbacks.map((fb) => (
          <div key={fb._id} className="feedback-card">
            <h4>{fb.name}</h4>
            <p><strong>Email:</strong> {fb.email}</p>
            <p><strong>Message:</strong> {fb.message}</p>
            <p><strong>Status:</strong> {fb.status}</p>
            <div className="btn-group">
              <button
                className="accept-btn"
                disabled={fb.status === 'accepted'}
                onClick={() => handleAccept(fb._id)}
              >
                Accept
              </button>
              <button
                className="reject-btn"
                disabled={fb.status === 'rejected'}
                onClick={() => handleReject(fb._id)}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminFeedbacks;
