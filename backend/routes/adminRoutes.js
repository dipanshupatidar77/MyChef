// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { adminLogin, getPendingChefs, approveChef, rejectChef,getApprovedChefs,blockChef,getAllPayments } = require('../controllers/adminController');
const { protectAdmin,verifyAdmin } = require('../middleware/authMiddleware');

// Admin login
router.post('/login', adminLogin);

// Admin dashboard
router.get('/pending-chefs', getPendingChefs);
router.put('/approve-chef/:chefId', approveChef);
router.delete('/reject-chef/:chefId', rejectChef);
router.get('/approved-chefs', getApprovedChefs);
router.patch('/block-chef/:chefId', protectAdmin, blockChef);
router.get('/get-all-payments', verifyAdmin, getAllPayments);



module.exports = router;
