// controllers/adminController.js
const Chef = require('../models/Chef');
//const { adminEmail, adminPassword } = require('../config/adminConfig');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
//const sendEmail = require('../utils/emailSender'); 
const Booking = require('../models/Booking');
const User = require('../models/User');
const sendEmail = require('../utils/emailSender'); 

const jwt = require('jsonwebtoken'); // add at the top if not already

exports.adminLogin = (req, res) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  console.log("Admin login body:", req.body);
  console.log("Received:", email, password);
  console.log("Expected:", adminEmail, adminPassword);

  if (email.trim() === adminEmail.trim() && password.trim() === adminPassword.trim()) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    return res.status(200).json({ msg: 'Admin login successful', token });
  } else {
    return res.status(401).json({ msg: 'Invalid admin credentials' });
  }
};


// Fetch all pending chefs
exports.getPendingChefs = async (req, res) => {
  try {
    const pendingChefs = await Chef.find({ isApproved: false });
    res.status(200).json(pendingChefs);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.approveChef = async (req, res) => {
  try {
    const { chefId } = req.params;
    console.log("Approving Chef ID:", chefId);

    if (!chefId) {
      return res.status(400).json({ msg: 'Chef ID not provided' });
    }

    const rawPassword = uuidv4().split('-')[0];
    console.log("Generated Password:", rawPassword);

    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const updatedChef = await Chef.findByIdAndUpdate(
      chefId,
      {
        isApproved: true,
        approvalPassword: hashedPassword
      },
      { new: true }
    );

    if (!updatedChef) {
      return res.status(404).json({ msg: 'Chef not found' });
    }

    // ✅ Send approval email to chef
    if (updatedChef.email) {
      await sendEmail({
        to: updatedChef.email,
        subject: 'Chef Approval - MyChef Platform',
        html: `
          <h2>Congratulations! 🎉</h2>
          <p>Dear ${updatedChef.name || 'Chef'},</p>
          <p>Your profile has been approved by the MyChef admin.</p>
          <p>You can now login using the following password:</p>
          <p><strong>Approval Password:</strong> ${rawPassword}</p>
          <br/>
          <p>Keep this password safe and do not share it with anyone.</p>
          <p>Visit the Chef Login page to get started.</p>
          <br/>
          <p>– The MyChef Team</p>
        `
      });
    }

    res.status(200).json({
      msg: 'Chef approved successfully',
      approvalPassword: rawPassword,
      chef: updatedChef
    });
  } catch (err) {
    console.error("Approve Chef Error:", err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.rejectChef = async (req, res) => {
  try {
    const { chefId } = req.params;

    // ✅ Get chef data before deleting
    const chef = await Chef.findById(chefId);
    if (!chef) {
      return res.status(404).json({ msg: 'Chef not found' });
    }

    // ✅ Send rejection email
    if (chef.email) {
      await sendEmail({
        to: chef.email,
        subject: 'Application Rejected - MyChef',
        html: `
          <h2>Hello ${chef.name || 'Chef'},</h2>
          <p>We appreciate your interest in joining <strong>MyChef</strong>.</p>
          <p>After reviewing your application, we regret to inform you that your registration has been <strong>rejected</strong> at this time.</p>
          <p>Thank you again for your time and effort. You may apply again in the future if you'd like.</p>
          <br/>
          <p>— The MyChef Team</p>
        `
      });
    }

    // ✅ Delete the chef
    await Chef.findByIdAndDelete(chefId);
    res.status(200).json({ msg: 'Chef rejected, deleted, and notified' });

  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
// Get all approved chefs
exports.getApprovedChefs = async (req, res) => {
  try {
    const approvedChefs = await Chef.find({ isApproved: true });
    res.status(200).json(approvedChefs);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// for blocking the chef

// exports.blockChef = async (req, res) => {
//   try {
//     const { chefId } = req.params;

//     // Step 1: Mark the chef as blocked
//     const chef = await Chef.findByIdAndUpdate(chefId, { isBlocked: true }, { new: true });

//     if (!chef) {
//       return res.status(404).json({ msg: 'Chef not found' });
//     }

//     // Step 2: Find all future bookings of this chef
//     const currentDate = new Date();
//     const upcomingBookings = await Booking.find({
//       chef: chefId,
//       bookingDate: { $gte: currentDate },
//       status: { $ne: 'cancelled' }
//     });

//     // Step 3: Cancel each booking and notify the user
//     for (const booking of upcomingBookings) {
//       booking.status = 'cancelled';
//       booking.note = 'Booking cancelled due to chef being blocked';
//       await booking.save();

//       // Get user email
//       const user = await User.findById(booking.user);
//       if (user) {
//         await sendEmail({
//           to: user.email,
//           subject: 'Chef Blocked - Booking Cancelled',
//           text: `Dear ${user.name},\n\nYour booking with chef ${chef.name} has been cancelled because the chef was blocked by our admin team.\n\nPlease rebook with another chef or contact support for refunds and more details.\n\nThank you,\nMyChef Team`
//         });
//       }
//     }

//     res.status(200).json({ msg: 'Chef blocked and upcoming bookings cancelled. Users notified.' });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// };


// exports.blockChef = async (req, res) => {
//   try {
//     const { chefId } = req.params;

//     // 1. Set isBlocked = true
//     const chef = await Chef.findByIdAndUpdate(
//       chefId,
//       { isBlocked: true ,password: null,
//         approvalPassword: null},
//       { new: true }
//     );

//     if (!chef) {
//       return res.status(404).json({ msg: 'Chef not found' });
//     }

//     // 2. Cancel all future bookings (pending/confirmed)
//     await Booking.updateMany(
//       {
//         chef: chefId,
//         status: { $in: ['pending', 'confirmed'] }
//       },
//       {
//         $set: {
//           status: 'cancelled',
//           cancelReason: 'chef_blocked'
//         }
//       }
//     );

//     res.status(200).json({ msg: 'Chef blocked and related bookings cancelled' });

//   } catch (error) {
//     res.status(500).json({ msg: 'Server error', error: error.message });
//   }
// };


exports.blockChef = async (req, res) => {
  try {
    const { chefId } = req.params;

    // ✅ 1. Block the chef
    const chef = await Chef.findByIdAndUpdate(chefId, { isBlocked: true,passward:null,approvalPassword:null }, { new: true });

    if (!chef) {
      return res.status(404).json({ msg: 'Chef not found' });
    }

    // ✅ 2. Send email to chef
    if (chef.email) {
      await sendEmail({
        to: chef.email,
        subject: 'Account Blocked - MyChef',
        html: `
          <h2>Notice: Your MyChef Account Has Been Blocked</h2>
          <p>Dear ${chef.name || 'Chef'},</p>
          <p>We regret to inform you that your account has been <strong>blocked</strong> by our admin team due to policy violations or user feedback.</p>
          <p>If you believe this was a mistake, please contact our support team at <a href="mailto:support@mychef.com">support@mychef.com</a>.</p>
          <br/>
          <p>– The MyChef Admin Team</p>
        `
      });
    }

    // ✅ 3. Notify all users who have bookings with this chef (not cancelled)
    const bookings = await Booking.find({ chef: chefId, status: { $ne: 'cancelled' } }).populate('user');

    const userNotificationPromises = bookings.map(booking => {
      const userEmail = booking.user?.email || booking.userEmail;

      if (userEmail) {
        return sendEmail({
          to: userEmail,
          subject: 'Important: Your Chef is No Longer Available',
          html: `
            <h2>Booking Alert: Chef Unavailable</h2>
            <p>Hi ${booking.user?.name || booking.userName || 'User'},</p>
            <p>We’re sorry to inform you that the chef assigned to your booking has been <strong>removed from the platform</strong>.</p>
            <p><strong>Event:</strong> ${booking.eventDetails}</p>
            <p><strong>Date:</strong> ${booking.eventDate} | <strong>Time:</strong> ${booking.eventTime}</p>
            <p><strong>Location:</strong> ${booking.location}, ${booking.city}</p>
            <br/>
            <p>👉 Please contact our support team immediately to request a refund or book a new chef:</p>
            <p><strong>Email:</strong> <a href="mailto:support@mychef.com">support@mychef.com</a></p>
            <br/>
            <p>Thank you for your understanding.</p>
            <p>– MyChef Team</p>
          `
        });
      }
    });

    await Promise.all(userNotificationPromises);

    res.status(200).json({ msg: 'Chef blocked and all affected users notified via email.' });
  } catch (err) {
    console.error('Error blocking chef:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


// exports.getAllPayments = async (req, res) => {
//   try {
//     const paidBookings = await Booking.find({ paymentStatus: 'done' })
//       .populate('user', 'name email')
//       .populate('chef', 'name chargesPerVisit')
//       .select('user chef eventDate paymentDate transactionId');

//     res.status(200).json({ payments: paidBookings });
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// };

exports.getAllPayments = async (req, res) => {
  try {
    const paidBookings = await Booking.find({ paymentStatus: 'done' })
      .populate('user', 'name email')
      .populate('chef', 'name chargesPerVisit') // ✅ now includes amount
      .select('user chef eventDate paymentDate transactionId');

    res.status(200).json({ payments: paidBookings });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


