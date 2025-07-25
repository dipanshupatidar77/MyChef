// utils/razorpayInstance.js
const Razorpay = require('razorpay');
const dotenv = require('dotenv');
dotenv.config(); // ✅ Load environment variables

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET, // ✅ Must match .env
});

// Optional: Debug logging
// console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
// console.log("Razorpay Secret:", process.env.RAZORPAY_KEY_SECRET); // ✅ Fixed logging key

module.exports = razorpayInstance; // ✅ Correct export
