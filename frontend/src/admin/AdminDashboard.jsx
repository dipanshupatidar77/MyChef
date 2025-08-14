import React, { useEffect, useState } from 'react';
import {
  getUnapprovedChefs,
  approveChefById,
  rejectChefById,
  getApprovedChefs,
  blockChefById,
} from '../services/adminApi';
import Swal from 'sweetalert2';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom'; //  for navigation

const AdminDashboard = () => {
  const [view, setView] = useState('pending');
  const [pendingChefs, setPendingChefs] = useState([]);
  const [approvedChefs, setApprovedChefs] = useState([]);
  const navigate = useNavigate(); //  for routing

  const fetchPendingChefs = async () => {
    const data = await getUnapprovedChefs();
    setPendingChefs(data);
  };

  const fetchApprovedChefs = async () => {
    const data = await getApprovedChefs();
    setApprovedChefs(data);
  };

  useEffect(() => {
    if (view === 'pending') fetchPendingChefs();
    else fetchApprovedChefs();
  }, [view]);

  const handleApprove = async (id) => {
    try {
      const res = await approveChefById(id);
      alert(`Chef approved.\nApproval Password: ${res.approvalPassword}`);
      fetchPendingChefs();
      fetchApprovedChefs();
    } catch (err) {
      alert('Error approving chef');
    }
  };

  const handleReject = async (id) => {
    await rejectChefById(id);
    alert('Chef rejected');
    fetchPendingChefs();
  };

  const handleBlockChef = async (id) => {
    const confirmation = await Swal.fire({
      title: 'Block this chef?',
      text: 'This chef will be removed from the platform and users will be notified.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, block',
      cancelButtonText: 'Cancel',
    });

    if (confirmation.isConfirmed) {
      try {
        await blockChefById(id);
        Swal.fire('Blocked!', 'Chef has been blocked and users notified.', 'success');
        fetchApprovedChefs();
      } catch (error) {
        Swal.fire('Error', error.response?.data?.msg || 'Something went wrong', 'error');
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Welcome Admin 👑</h2>
      <div className="admin-tabs">
        <button
          className={view === 'pending' ? 'active-tab' : ''}
          onClick={() => setView('pending')}
        >
          Pending Chef Requests
        </button>
        <button
          className={view === 'approved' ? 'active-tab' : ''}
          onClick={() => setView('approved')}
        >
          Approved Chefs
        </button>
        <button
          className="payment-tab"
          onClick={() => navigate('/admin/payments')} //  Navigate to payment details
        >
          💰 View Payment Details
        </button>
      </div>

      <button onClick={() => navigate('/admin/feedbacks')} className="admin-btn">
  User Feedbacks
</button>


      <div className="tab-content">
        {view === 'pending' ? (
          <>
            <h3>Pending Chef Approvals</h3>
            {pendingChefs.length === 0 ? (
              <p>No pending chefs.</p>
            ) : (
              pendingChefs.map((chef) => (
                <div key={chef._id} className="chef-card">
                  <h4>{chef.name}</h4>
                  <p>Email: {chef.email}</p>

                  {(chef.pdfPath || chef.chefPDF) && (
                    <a
                      href={
                        chef.pdfPath
                          ? `http://localhost:5000/uploads/${chef.pdfPath}`
                          : `http://localhost:5000/uploads/${chef.chefPDF.split('uploads\\')[1]}`
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Registration PDF
                    </a>
                  )}

                  <div className="action-buttons">
                    <button className="approve" onClick={() => handleApprove(chef._id)}>Approve</button>
                    <button className="reject" onClick={() => handleReject(chef._id)}>Reject</button>
                  </div>
                </div>
              ))
            )}
          </>
        ) : (
          <>
            <h3>Approved Chefs</h3>
            {approvedChefs.length === 0 ? (
              <p>No approved chefs found.</p>
            ) : (
              <>
                {/*  Non-blocked chefs shown first */}
                {approvedChefs
                  .filter((chef) => !chef.isBlocked)
                  .map((chef) => (
                    <div key={chef._id} className="chef-card approved">
                      <h4>{chef.name}</h4>
                      <p>Email: {chef.email}</p>
                      <p>City: {chef.city || 'N/A'}</p>
                      <div className="action-buttons">
                        <button className="reject" onClick={() => handleBlockChef(chef._id)}>
                          Block Chef
                        </button>
                      </div>
                    </div>
                  ))}

                {/*  Blocked chefs at bottom with label */}
                {approvedChefs
                  .filter((chef) => chef.isBlocked)
                  .map((chef) => (
                    <div key={chef._id} className="chef-card approved blocked-chef">
                      <h4>{chef.name}</h4>
                      <p>Email: {chef.email}</p>
                      <p>City: {chef.city || 'N/A'}</p>
                      <p className="blocked-label">🚫 Blocked by Admin</p>
                    </div>
                  ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
