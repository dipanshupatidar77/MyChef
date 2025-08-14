const path = require('path');
const fs = require('fs');
const Chef = require('../models/Chef');
const generateChefPDF = require('../utils/generateChefPDF');
const Booking = require('../models/Booking');
const User = require('../models/User');

exports.registerChef = async (req, res) => {
  try {
    console.log('Received chef registration body:', req.body);
    console.log('Received chef registration file:', req.file);

    const {
      name, email, password, mobile, experience, age,
      city, specialty, dishes, chargesPerVisit,
      serviceTimeFrom, serviceTimeTo
    } = req.body;

    const existing = await Chef.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Chef already exists' });

    const profilePicUrl = req.file?.path;

    const newChef = new Chef({
      name,
      email,
      password,
      mobile,
      experience,
      age,
      city,
      specialty: typeof specialty === 'string' ? JSON.parse(specialty) : specialty, // ✅ FIXED
      dishes: typeof dishes === 'string' ? JSON.parse(dishes) : dishes,
      chargesPerVisit,
      serviceTime: {
        from: serviceTimeFrom,
        to: serviceTimeTo
      },
      profilePicUrl,
      isApproved: false
    });

    const uploadDir = path.join(__dirname, '../uploads/chefs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${name.replace(/ /g, '_')}_${Date.now()}.pdf`;
    const pdfPath = path.join(uploadDir, filename);

    await generateChefPDF(newChef, profilePicUrl, pdfPath);
    newChef.pdfPath = `chefs/${filename}`;

    await newChef.save();

    res.status(201).json({ msg: 'Chef registered. Awaiting admin approval.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};



exports.getApprovedChefs = async (req, res) => {
  try {
    const { city } = req.query;

    //  Now exclude blocked chefs too
    let filter = { isApproved: true, isBlocked: { $ne: true } };

    if (city) {
      filter.city = { $regex: new RegExp(city, 'i') };
    }

    const chefs = await Chef.find(filter).select('name experience city profilePicUrl');
    res.status(200).json({ chefs });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};




exports.getChefById = async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id).select('-password');
    if (!chef) return res.status(404).json({ msg: 'Chef not found' });
    res.json(chef);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

exports.getPendingBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ chefId: req.user.id, status: 'pending' }).populate('userId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch pending bookings', error: err.message });
  }
};

exports.acceptBooking = async (bookingId) => {
  try {
    const token = localStorage.getItem('chefToken');
    if (!token) throw new Error('Chef token not found');

    const res = await fetch(`/api/chef/bookings/${bookingId}/accept`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.json();
  } catch (err) {
    console.error('Error accepting booking:', err);
    return null;
  }
};

exports.rejectBooking = async (bookingId) => {
  try {
    const token = localStorage.getItem('chefToken');
    if (!token) throw new Error('Chef token not found');

    const res = await fetch(`/api/chef/bookings/${bookingId}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.json();
  } catch (err) {
    console.error('Error rejecting booking:', err);
    return null;
  }
};

exports.getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email city')
      .populate('chef', 'name specialty');

    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    if (booking.chef.toString() !== req.user.id)
      return res.status(403).json({ msg: 'Unauthorized' });

    res.json({ booking });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};



exports.getChefUpcomingBookings = async (req, res) => {
  try {
    const chefId = req.user.id;

    const bookings = await Booking.find({
      chef: chefId,
      status: { $in: ['accepted', 'cancelled'] }, // include both accepted & cancelled
       exitConfirmed: false                       //  still upcoming, not completed
    })
      .populate('user', 'name')
      .populate('chef', 'name city chargesPerVisit');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};


//const Booking = require('../models/Booking');

exports.getChefReviews = async (req, res) => {
  try {
    const chefId = req.params.id;
    const bookings = await Booking.find({ chef: chefId, review: { $exists: true } });

    const reviews = bookings.map(b => ({
      user: b.userName,
      rating: b.review.rating,
      comment: b.review.comment,
    }));

    const totalRatings = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avgRating = reviews.length ? (totalRatings / reviews.length).toFixed(1) : 0;

    res.status(200).json({ avgRating, reviews });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

exports.getChefProfile = async (req, res) => {
  try {
    const chef = req.user; // Full chef is already on req.user from protectChef
    res.status(200).json(chef);
  } catch (error) {
    console.error('Error fetching chef profile:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// backend/controllers/chefController.js

// In chefController.js
exports.updateChefProfile = async (req, res) => {
  try {
    const chef = await Chef.findById(req.user._id);

    if (!chef) return res.status(404).json({ msg: 'Chef not found' });

    const fields = ['name', 'mobile', 'age', 'experience'];
    fields.forEach(field => {
      if (req.body[field]) chef[field] = req.body[field];
    });

    if (req.file) {
      chef.profilePicUrl = req.file.path; // or cloudinary URL if using it
    }

    await chef.save();
    res.status(200).json(chef);
  } catch (err) {
    console.error('Profile update error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


// controllers/chefController.js
exports.getChefCompletedBookings = async (req, res) => {
  try {
    const chefId = req.user.id;
    console.log("Fetching completed bookings for chef:", chefId); //  DEBUG

    const bookings = await Booking.find({
      chef: chefId,
      exitConfirmed: true
    })
      .populate('user', 'name')
      .populate('chef', 'name city');

    res.status(200).json(bookings);
  } catch (err) {
    console.error('❌ Error fetching completed bookings:', err); //  See this in terminal
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};













