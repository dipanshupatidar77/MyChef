import axios from 'axios';

export const getUserBookings = (token) => {
  return axios.get('/api/bookings/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const submitReview = (bookingId, rating, comment, token) =>
  axios.post(
    `/api/bookings/${bookingId}/review`,
    { rating, comment },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );


export const getChefReviews = async (chefId) => {
  const res = await axios.get(`/api/bookings/chef/${chefId}/reviews`);
  return res; //  Important: return the whole response object
};


export const cancelBooking = async (bookingId, token) => {
  return axios.patch(`/api/bookings/cancel/${bookingId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// services/userApi.js


