import axios from 'axios';

const API_BASE = '/api/admin'; // change if your backend URL is different

export const adminLogin = (credentials) => axios.post(`${API_BASE}/login`, credentials).then(res => res.data);

export const getUnapprovedChefs = () =>
  axios.get(`${API_BASE}/pending-chefs`).then(res => res.data);

export const approveChefById = (id) =>
  axios.put(`${API_BASE}/approve-chef/${id}`).then(res => res.data);

export const rejectChefById = (id) =>
  axios.delete(`${API_BASE}/reject-chef/${id}`).then(res => res.data);

export const getApprovedChefs = () =>
  axios.get('/api/admin/approved-chefs').then(res => res.data);

export const blockChefById = async (id) => {
  const token = localStorage.getItem('adminToken');
  const res = await axios.patch(`http://localhost:5000/api/admin/block-chef/${id}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return res.data;
};

// ✅ Corrected adminApi.js function
// ✅ adminApi.js
export const getAllPayments = async () => {
  const token = localStorage.getItem('adminToken'); // Ensure this exists
  const res = await axios.get('http://localhost:5000/api/admin/get-all-payments', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.payments; // ✅ Only the array
};


