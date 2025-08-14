const express = require('express');
const router = express.Router();
const {
  createOrder,
  updatePaymentStatus,
} = require('../controllers/paymentController');

//  Route must match this exactly
router.post('/create-order', createOrder);
router.put('/update-payment/:bookingId', updatePaymentStatus);

module.exports = router;
