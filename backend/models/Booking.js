const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    chef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chef',
      required: true
    },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userPhone: { type: String, required: true },
    contactMethod: {
      type: String,
      enum: ['email', 'phone', 'whatsapp'],
      required: true
    },
    city: { type: String, required: true },
    location: { type: String, required: true },
    eventDetails: { type: String },
    numberOfGuests: { type: Number, required: true },
    eventDate: { type: String, required: true },
    eventTime: { type: String, required: true },
    selectedDishes: [{ type: String }],
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected','cancelled','completed'],
      default: 'pending'
    },
    cancelReason: {
  type: String,
  enum: ['user_cancelled', 'chef_cancelled', 'chef_blocked'], //  Optional
},
    paymentStatus: {
      type: String,
      enum: ['pending', 'done'],
      default: 'pending'
    },
    transactionId: { type: String },
paymentDate: { type: Date },

    cancelledBy: {
  type: String,
  enum: ['user', 'chef', null],
  default: null
}
,
    review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String }
    },
    //  Added for Entry OTP
    entryOtp: { type: String },
    entryConfirmed: { type: Boolean, default: false },

    exitOtp: { type: String },
    exitConfirmed: { type: Boolean, default: false },

  },
  { timestamps: true } //  this is the second argument to schema, keep it separate
);

module.exports = mongoose.model('Booking', bookingSchema);
