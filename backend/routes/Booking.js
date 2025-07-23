// const express = require('express');
// const router = express.Router();
// const { createBooking,getChefBookings,getUserBookings,updateBookingStatus,checkDateAvailability,markPaymentDone } = require('../controllers/bookingController');
// const { protectUser } = require('../middleware/authMiddleware');
// const { protectChef } = require('../middleware/authMiddleware');

// // POST /api/bookings - only logged-in users can book
// router.post('/', protectUser,createBooking);
// // GET /api/bookings/chef/pending - chef’s pending bookings
// router.get('/chef/pending', protectChef, getChefBookings);
// // bookingRoutes.js
// router.get('/user', protectUser, getUserBookings);  // ✅ New route for user's own bookings

// // PATCH /api/bookings/:id/status (chef only)
// router.patch('/:id/status', protectChef, updateBookingStatus);

// // GET /api/bookings/check-availability?chefId=CHEF_ID&eventDate=YYYY-MM-DD
// router.get('/check-availability', checkDateAvailability);

// // routes/bookingRoutes.js
// //router.put('/bookings/:id/payment', verifyChef, markPaymentDone);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getChefBookings, 
  getUserBookings, 
  updateBookingStatus, 
  checkDateAvailability, 
  markPaymentDone ,
  generateEntryOtp, verifyEntryOtp ,
  generateExitOtp,verifyExitOtp,addBookingReview,getChefReviews,
} = require('../controllers/bookingController');

const { protectUser } = require('../middleware/authMiddleware');
const { protectChef } = require('../middleware/authMiddleware');

// POST /api/bookings - only logged-in users can book
router.post('/', protectUser, createBooking);

// GET /api/bookings/chef/pending - chef’s pending bookings
router.get('/chef/pending', protectChef, getChefBookings);

// ✅ New route for user's own bookings
router.get('/user', protectUser, getUserBookings);  

// PATCH /api/bookings/:id/status (chef only)
router.patch('/:id/status', protectChef, updateBookingStatus);

// GET /api/bookings/check-availability?chefId=CHEF_ID&eventDate=YYYY-MM-DD
router.get('/check-availability', checkDateAvailability);

// ✅ Added for updating payment status (for user)
//router.put('/:id/payment', protectUser, markPaymentDone);  // ✅ final change

router.post('/:id/entry-otp', protectChef, generateEntryOtp);

// ✅ POST to verify OTP
router.post('/:id/verify-entry-otp', protectChef, verifyEntryOtp);

router.post('/:id/exit-otp', protectChef, generateExitOtp);
router.post('/:id/verify-exit-otp', protectChef, verifyExitOtp);

// POST /api/bookings/:id/review
router.post('/:id/review', protectUser, addBookingReview);

// Get all reviews for a chef
router.get('/chef/:chefId/reviews', getChefReviews);


module.exports = router;
