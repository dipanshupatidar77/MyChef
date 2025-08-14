
const express = require('express');
const router = express.Router();
const { cancelBooking } = require('../controllers/bookingController');
const { protectUser } = require('../middleware/authMiddleware');

router.patch('/cancel/:id', protectUser, cancelBooking);  // PATCH /api/bookings/cancel/:id

module.exports = router;
