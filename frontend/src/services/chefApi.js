import axios from 'axios';

export const getAllApprovedChefs = () =>
  axios.get('/api/chefs/approved').then(res => res.data.chefs); // ✅

export const searchChefsByCity = (city) =>
  axios.get(`/api/chefs/approved?city=${city}`).then(res => res.data.chefs); // ✅

export const getChefById = (id) =>
  axios.get(`/api/chefs/${id}`).then(res => res.data.chef);

// Example
// For fetching pending bookings

export const getPendingBookings = async () => {
  const token = localStorage.getItem('chefToken'); // ✅ Correct token
  try {
    const res = await axios.get('/api/bookings/chef/pending', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    console.error('Error fetching pending bookings:', err);
    return [];
  }
};
// ✅ Accept booking
export const acceptBooking = async (bookingId, token) => {
  try {
    const res = await fetch(`/api/chef/bookings/${bookingId}/accept`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.json();
  } catch (err) {
    console.error('Error accepting booking:', err);
    return null;
  }
};

// ✅ Reject booking
export const rejectBooking = async (bookingId, token) => {
  try {
    const res = await fetch(`/api/chef/bookings/${bookingId}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.json();
  } catch (err) {
    console.error('Error rejecting booking:', err);
    return null;
  }
};

// updateBooking for the accept and reject button 

// src/services/chefApi.js

export const updateBookingStatus = async (bookingId, status) => {
  try {
    const token = localStorage.getItem('chefToken'); // ✅ FIXED HERE

    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.patch(
      `/api/bookings/${bookingId}/status`,
      { status: status.toLowerCase() },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Error updating booking status:`, error);
    throw error;
  }
};


// chefApi.js


export const getUpcomingBookings = (token) => {
  return axios.get('/api/chef/bookings/upcoming', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const sendEntryOtp = async (bookingId, token) => {
  return await axios.post(
    `/api/bookings/${bookingId}/entry-otp`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const verifyEntryOtp = (bookingId, otp, token) => {
  return axios.post(
    `/api/bookings/${bookingId}/verify-entry-otp`,
    { otp }, // ✅ body must be JSON with "otp"
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const sendExitOtp = async (bookingId, token) => {
  return await axios.post(
    `/api/bookings/${bookingId}/exit-otp`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export const verifyExitOtp = async (bookingId, otp, token) => {
  return await axios.post(
    `/api/bookings/${bookingId}/verify-exit-otp`,
    { otp },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};
// cancallation logic
export const cancelBookingByChef = (bookingId, token) => {
  return axios.put(`/api/chef/bookings/${bookingId}/cancel-by-chef`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const getCompletedBookings = (token) => {
  return axios.get('/api/chef/completed-bookings', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

