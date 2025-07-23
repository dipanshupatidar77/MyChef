// all the profile releted 
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
  registerChef,
  getApprovedChefs,
  getChefById ,getChefReviews,getChefProfile,updateChefProfile,getChefCompletedBookings
} = require('../controllers/chefController');
const { protectChef } = require('../middleware/authMiddleware');
router.get('/me', protectChef, getChefProfile);

router.put('/update-profile', protectChef, upload.single('profilePic'), updateChefProfile);

// Existing routes
router.post('/register-chef', upload.single('profilePic'), registerChef);
router.get('/', getApprovedChefs);
router.get('/approved', getApprovedChefs);

// ✅ NEW: Route to fetch chef by ID
router.get('/:id', getChefById);

router.get('/:id/reviews', getChefReviews); //  New route

// routes/chefRoutes.js
//router.get('/completed-bookings',protectChef, getChefCompletedBookings);

module.exports = router;
