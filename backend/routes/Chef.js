// // booking releted operations 
// const express = require('express');
// const router = express.Router();
// const { 
//   getPendingBookings,
//   acceptBooking,
//   rejectBooking,
//   getBookingDetails,
//   getChefUpcomingBookings,
// } = require('../controllers/chefController');
// const { cancelBookingByChef } = require('../controllers/bookingController');

// const { verifyChef,protectChef } = require('../middleware/authMiddleware');

// // router.get('/bookings/pending', verifyChef, getPendingBookings);
// // router.put('/bookings/:id/accept', verifyChef, acceptBooking);
// // router.put('/bookings/:id/reject', verifyChef, rejectBooking);
// // router.get('/bookings/:id', verifyChef, getBookingDetails); // ✅ NEW
// // // Route: GET /api/chef/bookings/accepted
// // //router.get('/bookings/accepted', protectChef, getChefUpcomingBookings);
// // router.get('/bookings/upcoming', protectChef, getChefUpcomingBookings);


// // ✅ Put specific routes BEFORE dynamic ones
// router.get('/bookings/upcoming', verifyChef, getChefUpcomingBookings);
// router.get('/bookings/pending', verifyChef, getPendingBookings);
// router.get('/completed-bookings', protectChef, getChefCompletedBookings);
// router.put('/bookings/:id/accept', verifyChef, acceptBooking);
// router.put('/bookings/:id/reject', verifyChef, rejectBooking);
// router.get('/bookings/:id', verifyChef, getBookingDetails); // ❌ Move this last
// router.put('/bookings/:id/cancel-by-chef', verifyChef, cancelBookingByChef);
// //router.get('/completed-bookings', protectChef, getChefCompletedBookings);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { 
  getPendingBookings,
  acceptBooking,
  rejectBooking,
  getBookingDetails,
  getChefUpcomingBookings,
  getChefCompletedBookings // ✅ Add this here
} = require('../controllers/chefController');

const { cancelBookingByChef } = require('../controllers/bookingController');
const { verifyChef, protectChef } = require('../middleware/authMiddleware');

// Put specific routes BEFORE dynamic ones
router.get('/bookings/upcoming', verifyChef, getChefUpcomingBookings);
router.get('/bookings/pending', verifyChef, getPendingBookings);
router.get('/completed-bookings', protectChef, getChefCompletedBookings); // ✅ Correct location
router.put('/bookings/:id/accept', verifyChef, acceptBooking);
router.put('/bookings/:id/reject', verifyChef, rejectBooking);
router.get('/bookings/:id', verifyChef, getBookingDetails);
router.put('/bookings/:id/cancel-by-chef', verifyChef, cancelBookingByChef);

module.exports = router;
