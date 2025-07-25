import axios from 'axios';

export const createOrder = (amount, bookingId) => {
  return axios.post(
    'http://localhost:5000/api/payments/create-order',
    { amount, bookingId },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`
      }
    }
  );
};

// export const updatePaymentStatus = (bookingId) => {
//   return axios.put(
//     `http://localhost:5000/api/payments/update-payment/${bookingId}`,
//     {},
//     {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('userToken')}`
//       }
//     }
//   );
// };

// export const updatePaymentStatus = async (bookingId) => {
//   const token = localStorage.getItem('userToken');
//   return await axios.put(
//     `http://localhost:5000/api/payments/update-payment/${bookingId}`, //  This route exists
//     {},
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
// };

export const updatePaymentStatus = async (bookingId, transactionId) => {
  const token = localStorage.getItem('userToken'); // or 'adminToken' if from admin

  return await axios.put(
    `http://localhost:5000/api/payments/update-payment/${bookingId}`,
    { transactionId }, //  Correct syntax
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

