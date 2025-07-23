const express = require('express');
const router = express.Router();
const { getUserProfile,updateUserProfile } = require('../controllers/userController');
const { protectUser } = require('../middleware/authMiddleware');

router.get('/me', protectUser, getUserProfile);

router.put('/profile', protectUser, updateUserProfile); 
module.exports = router;
