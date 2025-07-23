// server.js
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');

const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');



const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Static files (for serving uploaded images or PDFs if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));     // User, Chef, Admin login/register
app.use('/api/chefs', require('./routes/chefRoutes'));    // Chef-specific actions (register, profile, etc.)
app.use('/api/admin', require('./routes/adminRoutes'));   // Admin approval panel & actions
const booking = require('./routes/Booking');
app.use('/api/bookings', booking);
const chefRoutes = require('./routes/Chef');
app.use('/api/chef', chefRoutes);

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payments', paymentRoutes);


app.use('/api/bookings', require('./routes/bookingRoutes'));


const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes); //  VERY IMPORTANT

const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/api/feedback', feedbackRoutes);


// Error Handling Middleware (optional but useful)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Something went wrong!', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
