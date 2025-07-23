// const express = require('express');
// const router = express.Router();
// const Booking = require('../models/Booking');

// // ✅ Route to fetch accepted booked dates for a chef
// router.get('/chef/:chefId/booked-dates', async (req, res) => {
//   try {
//     const bookings = await Booking.find({
//       chef: req.params.chefId,
//       status: 'accepted',
//     });

//     // Extract unique eventDate values as 'YYYY-MM-DD'
//     const dateSet = new Set();

//     bookings.forEach((booking) => {
//       const formatted = booking.eventDate.toISOString().split('T')[0]; // "2026-01-01"
//       dateSet.add(formatted);
//     });

//     const bookedDates = Array.from(dateSet);

//     res.status(200).json(bookedDates);
//   } catch (error) {
//     console.error("Error fetching booked dates:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const { cancelBooking } = require('../controllers/bookingController');
const { protectUser } = require('../middleware/authMiddleware');

router.patch('/cancel/:id', protectUser, cancelBooking);  // PATCH /api/bookings/cancel/:id

module.exports = router;
