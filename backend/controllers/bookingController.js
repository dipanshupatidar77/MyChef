const Booking = require('../models/Booking');
const sendEmail = require('../utils/emailSender');
const Chef = require('../models/Chef'); // ✅ Required to fetch chef's email

exports.createBooking = async (req, res) => {
  try {
    const {
      chefId,
      userName,
      userEmail,
      userPhone,
      contactMethod,
      city,
      location,
      eventDetails,
      numberOfGuests,
      eventDate,
      eventTime,
      selectedDishes
    } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }

    const newBooking = new Booking({
      user: req.user._id,
      chef: chefId,
      userName,
      userEmail,
      userPhone,
      contactMethod,
      city,
      location,
      eventDetails,
      numberOfGuests,
      eventDate,
      eventTime,
      selectedDishes
    });

    await newBooking.save();
    console.log(await Booking.find()); // in createBooking

    // ✅ Send email to the user confirming booking creation
    await sendEmail({
      to: userEmail,
      subject: 'MyChef Booking Confirmation',
      html: `
        <h2>Booking Submited Successfully 🎉</h2>
        <p>Hi ${userName},</p>
        <p>Your booking request has been successfully submitted!</p>
        <p><strong>Date:</strong> ${eventDate} at ${eventTime}</p>
        <p><strong>Location:</strong> ${location}, ${city}</p>
        <p><strong>Number of Guests:</strong> ${numberOfGuests}</p>
        <p><strong>Dishes:</strong> ${selectedDishes?.join(", ")}</p>
        <p>Chef will confirm soon. Stay tuned!</p>
        <br/>
        <p>– The MyChef Team</p>
      `
    });

    // ✅ Send email to the chef notifying new booking
    const chef = await Chef.findById(chefId);
    if (chef && chef.email) {
      await sendEmail({
        to: chef.email,
        subject: 'New Booking Request - MyChef',
        html: `
          <h2>You Have a New Booking Request 📩</h2>
          <p>Hello ${chef.fullName || 'Chef'},</p>
          <p>You have received a new booking request.</p>
          <p><strong>Customer Name:</strong> ${userName}</p>
          <p><strong>Event Date:</strong> ${eventDate}</p>
          <p><strong>Time:</strong> ${eventTime}</p>
          <p><strong>Location:</strong> ${location}, ${city}</p>
          <p><strong>Number of Guests:</strong> ${numberOfGuests}</p>
          <p><strong>Contact:</strong> ${userPhone}</p>
          <br/>
          <p>Please login to your dashboard to accept or reject the request.</p>
          <br/>
          <p>– The MyChef Team</p>
        `
      });
    }

    res.status(201).json({ msg: 'Booking created. Waiting for chef confirmation.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getChefBookings = async (req, res) => {
  try {
    const chefId = req.user._id;
    const bookings = await Booking.find({ chef: chefId, status: 'pending' });
    res.status(200).json(bookings);
  } catch (err) {
    console.error('Error fetching chef bookings:', err);
    res.status(500).json({ error: 'Failed to fetch chef bookings' });
  }
};

// Get all bookings by logged-in user


exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('chef') // includes chef info
      .sort({ createdAt: -1 });
    // this part is debug
      console.log('Fetched bookings:', bookings);
     bookings.forEach(b => {
  console.log(`Booking ID: ${b._id}, Payment: ${b.paymentStatus}`);
});
// debug 
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Accept or Reject Booking

exports.updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['accepted', 'rejected'];

  if (!validStatuses.includes(status.toLowerCase())) {
    return res.status(400).json({ msg: 'Invalid status' });
  }

  console.log("Received status:", status);

  try {
    const bookingId = req.params.id;

    // ✅ Populate user to get user email
    const booking = await Booking.findById(bookingId).populate('user');

    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    if (booking.chef.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'You are not authorized to update this booking' });
    }

    booking.status = status.toLowerCase(); // ✅ Match the enum

    await booking.save();

    // ✅ Send email to user based on status
    if (booking.user && booking.user.email) {
      let subject = '';
      let html = '';

      if (status.toLowerCase() === 'accepted') {
        subject = 'Your Booking Has Been Accepted 🎉';
        html = `
          <h2>Great News! 🙌</h2>
          <p>Hi ${booking.userName || booking.user.name || 'User'},</p>
          <p>Your booking has been <strong>accepted</strong> by the chef.</p>
          <p><strong>Event:</strong> ${booking.eventDetails}</p>
          <p><strong>Date:</strong> ${booking.eventDate} | <strong>Time:</strong> ${booking.eventTime}</p>
          <p><strong>Location:</strong> ${booking.location}, ${booking.city}</p>
          <br/>
          <p>Thank you for using <strong>MyChef</strong>. Enjoy your event!</p>
          <br/>
          <p>– The MyChef Team</p>
        `;
      } else if (status.toLowerCase() === 'rejected') {
        subject = 'Your Booking Was Rejected ❌';
        html = `
          <h2>We're Sorry 😞</h2>
          <p>Hi ${booking.userName || booking.user.name || 'User'},</p>
          <p>Your booking has been <strong>rejected</strong> by the chef.</p>
          <p><strong>Event:</strong> ${booking.eventDetails}</p>
          <p><strong>Date:</strong> ${booking.eventDate} | <strong>Time:</strong> ${booking.eventTime}</p>
          <p><strong>Location:</strong> ${booking.location}, ${booking.city}</p>
          <br/>
          <p>You can go back to <a href="https://mychef.example.com/book">MyChef</a> and choose another chef.</p>
          <p>We’re here to help make your event special!</p>
          <br/>
          <p>– The MyChef Team</p>
        `;
      }

      await sendEmail({ to: booking.user.email, subject, html });
    }

    res.json({ msg: `Booking ${status.toLowerCase()} successfully`, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.checkDateAvailability = async (req, res) => {
  const { chefId, eventDate } = req.query;

  try {
    const existing = await Booking.findOne({
      chef: chefId,
      eventDate,
      status: 'accepted',
    });

    if (existing) {
      return res.json({ available: false });
    }

    return res.json({ available: true });
  } catch (err) {
    console.error('Error checking date:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.markPaymentDone = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    booking.paymentStatus = 'done';
    await booking.save();

    res.status(200).json({ msg: 'Payment status updated to done ✅' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error updating payment status' });
  }
};


exports.generateEntryOtp = async (req, res) => {
  try {
    // ✅ Populate user to get user email
    const booking = await Booking.findById(req.params.id).populate('user');

    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    // Only chef can trigger
    if (booking.chef.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    booking.entryOtp = otp;
    booking.entryConfirmed = false;

    await booking.save();

    // ✅ Log OTP for development/testing
    console.log(`Generated OTP for Booking ID ${booking._id}:`, otp);

    // ✅ Send OTP via email to user
    if (booking.user && booking.user.email) {
      await sendEmail({
        to: booking.user.email,
        subject: 'MyChef - Entry OTP',
        html: `
          <h2>Chef Entry OTP 🚪</h2>
          <p>Hi ${booking.user.name || 'User'},</p>
          <p>Your chef has arrived. Please use the following OTP to confirm their entry:</p>
          <h3>${otp}</h3>
          <p>Event: ${booking.eventDetails}</p>
          <p>Date: ${booking.eventDate} | Time: ${booking.eventTime}</p>
          <br/>
          <p>– The MyChef Team</p>
        `
      });
    }

    res.status(200).json({ msg: 'Entry OTP generated', otp });
  } catch (err) {
    console.error('Error generating entry OTP:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// 2. Verify Entry OTP
exports.verifyEntryOtp = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    // Only the assigned chef can verify
    if (booking.chef.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const { otp } = req.body;

    // ✅ Compare with stored OTP
    if (booking.entryOtp !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    booking.entryConfirmed = true;
    booking.entryOtp = null; // clear otp after verification
    await booking.save();
    

     console.log("Stored OTP:", booking.entryOtp);
     console.log("Received OTP:", otp);


    return res.status(200).json({ msg: 'Entry OTP verified successfully ✅' });
  } catch (err) {
    console.error('Error verifying entry OTP:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};


exports.generateExitOtp = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user'); // ✅ populate user to get email
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    if (booking.chef.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    booking.exitOtp = otp;
    booking.exitConfirmed = false;

    await booking.save();

    console.log(`[EXIT OTP]: ${otp}`); // ⬅️ TEMP for testing

    // ✅ Email the exit OTP to the user
    if (booking.user && booking.user.email) {
      await sendEmail({
        to: booking.user.email,
        subject: 'MyChef - Exit OTP for Your Event',
        html: `
          <h2>Chef Exit OTP 🔐</h2>
          <p>Hi ${booking.userName || booking.user.name || 'User'},</p>
          <p>Your chef has completed the service. Please use the following OTP to confirm their exit:</p>
          <h3>${otp}</h3>
          <p><strong>Event:</strong> ${booking.eventDetails}</p>
          <p><strong>Date:</strong> ${booking.eventDate} | <strong>Time:</strong> ${booking.eventTime}</p>
          <br/>
          <p>Thank you for trusting <strong>MyChef</strong> to make your event special. We hope to serve you again soon!</p>
          <p><a href="https://mychef.example.com/feedback/${booking._id}">Leave feedback for your chef</a></p>
          <br/>
          <p>– The MyChef Team</p>
        `
      });
    }

    res.status(200).json({ msg: 'Exit OTP generated', otp });
  } catch (err) {
    console.error('Error generating exit OTP:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Verify Exit OTP
// exports.verifyExitOtp = async (req, res) => {
//   try {
//     const { otp } = req.body;
//     const booking = await Booking.findById(req.params.id);

//     if (!booking) return res.status(404).json({ msg: 'Booking not found' });

//     if (booking.exitOtp !== otp) {
//       return res.status(400).json({ msg: 'Invalid OTP' });
//     }

//     booking.exitConfirmed = true;
//     //booking.exitConfirmed = 'completed';// added this line here
//     booking.status = 'completed';
//     await booking.save();
     
//     res.status(200).json({ msg: 'Exit OTP verified successfully ✅' });
//   } catch (err) {
//     console.error('Error verifying exit OTP:', err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

exports.verifyExitOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    if (booking.exitOtp !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    booking.exitConfirmed = true;         // ✅ proper boolean
    booking.status = 'completed';         // ✅ status updated

    await booking.save();

    res.status(200).json({ msg: 'Exit OTP verified successfully ✅' });
  } catch (err) {
    console.error('Error verifying exit OTP:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};








exports.addBookingReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    // Only allow review after exit is confirmed
    if (!booking.exitConfirmed)
      return res.status(400).json({ msg: 'Cannot review before booking is completed' });

    // Only the user who booked can review
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ msg: 'Unauthorized' });

    booking.review = { rating, comment };
    await booking.save();

    res.status(200).json({ msg: 'Review submitted successfully' });
  } catch (err) {
    console.error('Error saving review:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.getChefReviews = async (req, res) => {
  try {
    const { chefId } = req.params;

    const bookings = await Booking.find({
      chef: chefId,
      review: { $exists: true },
    }).populate('user', 'name');

    const reviews = bookings
      .filter(b => b.review && typeof b.review.rating === 'number') //  avoid undefined/null
      .map(booking => ({
        userName: booking.user?.name || 'Unknown',
        review: {
          rating: booking.review.rating || 0,
          comment: booking.review.comment || '',
        },
        date: booking.updatedAt,
      }));

    const totalRatings = reviews.reduce((acc, r) => acc + r.review.rating, 0);
    const avgRating = reviews.length ? (totalRatings / reviews.length).toFixed(1) : 0;

    res.status(200).json({ avgRating, reviews });
  } catch (err) {
    console.error('Error fetching chef reviews:', err);
    res.status(500).json({ msg: 'Failed to fetch reviews' });
  }
};

// // cancellation from the userside( cancel booking by the USer)
// exports.cancelBooking = async (req, res) => {
//   try {
//     const bookingId = req.params.id;
//     const booking = await Booking.findById(bookingId);

//     if (!booking) {
//       return res.status(404).json({ msg: 'Booking not found' });
//     }

//     // Check if already cancelled
//     if (booking.status === 'cancelled') {
//       return res.status(400).json({ msg: 'Booking is already cancelled' });
//     }

//     // Calculate time difference
//     const now = new Date();
//     const bookingTime = new Date(booking.bookingDateTime); // make sure this exists in DB
//     const diffInMs = bookingTime - now;
//     const diffInHours = diffInMs / (1000 * 60 * 60);

//     if (diffInHours < 48) {
//       return res.status(400).json({ msg: 'Booking can only be cancelled before 48 hours' });
//     }

//     // Update booking status
//     booking.status = 'cancelled';
//     await booking.save();

//     res.status(200).json({ msg: 'Booking cancelled successfully' });
//   } catch (error) {
//     res.status(500).json({ msg: 'Server error', error: error.message });
//   }
// };

// exports.cancelBooking = async (req, res) => {
//   try {
//     const bookingId = req.params.id;
//     const booking = await Booking.findById(bookingId);

//     if (!booking) {
//       return res.status(404).json({ msg: 'Booking not found' });
//     }

//     if (booking.status === 'cancelled') {
//       return res.status(400).json({ msg: 'Booking is already cancelled' });
//     }

//     const now = new Date();
//     const bookingTime = new Date(booking.bookingDateTime);
//     const diffInMs = bookingTime - now;
//     const diffInHours = diffInMs / (1000 * 60 * 60);

//     if (diffInHours < 48) {
//       return res.status(400).json({ msg: 'Booking can only be cancelled before 48 hours' });
//     }

//     booking.status = 'cancelled';
//     booking.cancelledBy = 'user'; // ✅ Important line
//     await booking.save();

//     res.status(200).json({ msg: 'Booking cancelled successfully' });
//   } catch (error) {
//     res.status(500).json({ msg: 'Server error', error: error.message });
//   }
// };

exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    // ✅ populate chef to get email
    const booking = await Booking.findById(bookingId).populate('chef');

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ msg: 'Booking is already cancelled' });
    }

    const now = new Date();
    const bookingTime = new Date(booking.bookingDateTime);
    const diffInMs = bookingTime - now;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 48) {
      return res.status(400).json({ msg: 'Booking can only be cancelled before 48 hours' });
    }

    booking.status = 'cancelled';
    booking.cancelledBy = 'user';
    await booking.save();

    // ✅ Email the chef that booking was cancelled
    if (booking.chef && booking.chef.email) {
      await sendEmail({
        to: booking.chef.email,
        subject: 'Booking Cancelled by User ❌',
        html: `
          <h2>Heads Up, Your Booking Was Cancelled</h2>
          <p>Hi ${booking.chef.fullName || 'Chef'},</p>
          <p>Unfortunately, the following booking has been <strong>cancelled</strong> by the user:</p>
          <ul>
            <li><strong>Event:</strong> ${booking.eventDetails}</li>
            <li><strong>Date:</strong> ${booking.eventDate}</li>
            <li><strong>Time:</strong> ${booking.eventTime}</li>
            <li><strong>Location:</strong> ${booking.location}, ${booking.city}</li>
          </ul>
          <p>No worries — we’ll keep you updated with future opportunities.</p>
          <p>Thanks for being a part of the <strong>MyChef</strong> family! 👨‍🍳</p>
          <br/>
          <p>– The MyChef Team</p>
        `
      });
    }

    res.status(200).json({ msg: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// cancellation from the chef side 

// exports.cancelBookingByChef = async (req, res) => {
//   try {
//     const bookingId = req.params.id;
//     const chefId = req.user.id;

//     const booking = await Booking.findById(bookingId);

//     if (!booking) {
//       return res.status(404).json({ msg: 'Booking not found' });
//     }

//     // ✅ Check if this booking belongs to the logged-in chef
//     if (booking.chef.toString() !== chefId.toString()) {
//       return res.status(403).json({ msg: 'Unauthorized access to this booking' });
//     }

//     // ✅ Allow cancellation only if booking is not already cancelled
//     if (booking.status === 'cancelled') {
//       return res.status(400).json({ msg: 'Booking already cancelled' });
//     }

//     // ✅ Mark booking as cancelled
//     booking.status = 'cancelled';
//     await booking.save();

//     // ✅ In real-world scenario: Track cancellation count per chef/month

//     res.status(200).json({
//       msg: 'Booking cancelled successfully by chef',
//       note: 'You have only 2 free cancellations allowed per month. After that, your payout will be reduced as penalty.'
//     });
//   } catch (error) {
//     console.error('Error cancelling booking by chef:', error.message);
//     res.status(500).json({ msg: 'Server error', error: error.message });
//   }
// };


//const sendEmail = require('../utils/emailSender'); // ✅ Add this if not already at top

exports.cancelBookingByChef = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const chefId = req.user.id;

    // ✅ populate user to notify them
    const booking = await Booking.findById(bookingId).populate('user');

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // ✅ Check if this booking belongs to the logged-in chef
    if (booking.chef.toString() !== chefId.toString()) {
      return res.status(403).json({ msg: 'Unauthorized access to this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ msg: 'Booking already cancelled' });
    }

    // ✅ Mark booking as cancelled
    booking.status = 'cancelled';
    await booking.save();

    // ✅ Send cancellation email to the user
    if (booking.user && booking.user.email) {
      await sendEmail({
        to: booking.user.email,
        subject: 'Urgent: Your Booking Was Cancelled by Chef ❌',
        html: `
          <h2>We Regret to Inform You 😞</h2>
          <p>Hi ${booking.userName || booking.user.name || 'User'},</p>
          <p>Unfortunately, your upcoming booking has been <strong>cancelled</strong> by the chef.</p>
          <ul>
            <li><strong>Event:</strong> ${booking.eventDetails}</li>
            <li><strong>Date:</strong> ${booking.eventDate}</li>
            <li><strong>Time:</strong> ${booking.eventTime}</li>
            <li><strong>Location:</strong> ${booking.location}, ${booking.city}</li>
          </ul>

          <p>We understand how frustrating this can be and we’re here to help.</p>
          <p><strong>If this cancellation happened within 24 hours of your event</strong>, please contact our support team immediately.</p>
          
          <p>📞 <strong>Support:</strong> <a href="mailto:support@mychef.com">support@mychef.com</a></p>

          <p>We can help you arrange an alternate chef or provide a refund based on the situation.</p>

          <br/>
          <p>We apologize for the inconvenience caused. Your trust means everything to us.</p>
          <p>– The MyChef Team</p>
        `
      });
    }

    res.status(200).json({
      msg: 'Booking cancelled successfully by chef',
      note: 'You have only 2 free cancellations allowed per month. After that, your payout will be reduced as penalty.'
    });
  } catch (error) {
    console.error('Error cancelling booking by chef:', error.message);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};
