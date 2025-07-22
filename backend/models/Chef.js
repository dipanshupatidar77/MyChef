const mongoose = require('mongoose');

const ChefSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  mobile: String,
  experience: Number,
  age: Number,
  city: String,
  totalHousesServed: {
  type: Number,
  default: 0,
},

  specialty: {
  type: [String],
  enum: ['veg', 'non-veg', 'both', 'gujarati', 'marathi', 'rajasthani', 'chinese']
},

isBlocked: {
  type: Boolean,
  default: false
},

  dishes: [String],
  chargesPerVisit: Number,
  serviceTime: {
    from: String,
    to: String
  },
  profilePicUrl: String,
  chefPDF: String,  
  pdfPath: {
  type: String,
  required: true
}
,             // Local path to PDF
  isApproved: { type: Boolean, default: false },
  approvalPassword: String       // Given by admin
});

module.exports = mongoose.model('Chef', ChefSchema);
