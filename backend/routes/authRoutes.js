const express = require('express');
const router = express.Router();
const upload = require('../config/multer');

const {
  registerUser,
  registerChef,
  loginUser
} = require('../controllers/authController');

// Route for user registration
router.post('/register-user', upload.single('profilePic'), registerUser);

// Route for chef registration
router.post('/register-chef', upload.single('profilePic'), registerChef);

// Login route (for all roles)
router.post('/login', loginUser);

module.exports = router;
