// controllers/paymentController.js
const razorpayInstance = require('../utils/razorpayInstance'); //  use the correct instance
const Booking = require('../models/Booking');

exports.createOrder = async (req, res) => {
  const { amount, bookingId } = req.body;

  if (!amount || !bookingId) {
    return res.status(400).json({
      error: {
        code: 'BAD_REQUEST_ERROR',
        description: 'amount and bookingId are required.',
      },
    });
  }

  try {
    console.log('Creating order with amount:', amount);

    const options = {
      amount: amount * 100, // Razorpay uses paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    // Use the correct instance here
    const order = await razorpayInstance.orders.create(options);
    return res.status(200).json({ order, success: true });

  } catch (err) {
    console.error('Error creating order:', err);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        description: 'Something went wrong while creating order',
        details: err.message,
      },
    });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.paymentStatus = 'done';
    booking.paymentDate = new Date();
    booking.transactionId = req.body.transactionId || 'test_txn_' + Date.now(); 

    await booking.save();

    res.status(200).json({ message: 'Payment status updated successfully' });
  } catch (error) {
    console.error('Payment update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



