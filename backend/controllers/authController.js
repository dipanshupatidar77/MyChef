const User = require('../models/User');
const Chef = require('../models/Chef');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');
const generateChefPDF = require('../utils/generateChefPDF');
const path = require('path');
const fs = require('fs');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, city, location } = req.body;
    const file = req.file;

    const upload = await cloudinary.uploader.upload(file.path);
    const user = new User({
      name, email, password, city, location,
      profilePicUrl: upload.secure_url
    });

    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error registering user", error: err.message });
  }
};

exports.registerChef = async (req, res) => {
  try {
    const {
      name, email, password, mobile, experience, age,
      city, specialty, dishes, chargesPerVisit, serviceTimeFrom, serviceTimeTo
    } = req.body;

    const file = req.file;

    const profileUpload = await cloudinary.uploader.upload(file.path);

    const chef = new Chef({
      name,
      email,
      password,
      mobile,
      experience,
      age,
      city,
      specialty,
      dishes: dishes.split(','), // assuming frontend sends comma-separated string
      chargesPerVisit,
      serviceTime: { from: serviceTimeFrom, to: serviceTimeTo },
      profilePicUrl: profileUpload.secure_url,
      isApproved: false // by default false
    });

    // Generate PDF and save locally
    const pdfPath = path.join(__dirname, `../uploads/chefs/${chef._id}.pdf`);
    await generateChefPDF(chef, pdfPath);

    chef.chefPDF = pdfPath;
    await chef.save();

    res.status(201).json({ msg: "Chef registered successfully. Pending approval by admin." });

  } catch (err) {
    res.status(500).json({ msg: "Error registering chef", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password, role, approvalPassword } = req.body;

  try {
    // if (role === 'user') {
    //   const user = await User.findOne({ email });
    //   if (!user || user.password !== password) return res.status(400).json({ msg: 'Invalid credentials' });

    //   const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET);
    //   return res.json({ token });
    if (role === 'user') {
  const user = await User.findOne({ email });
  if (!user || user.password !== password) return res.status(400).json({ msg: 'Invalid credentials' });
  console.log("JWT_SECRET at login:", process.env.JWT_SECRET);

  const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET);
  

  return res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      city: user.city,
      role:'user',
    }
  });
}

    

   if (role === 'chef') {
  const chef = await Chef.findOne({ email });
  if (!chef || chef.password !== password) return res.status(400).json({ msg: 'Invalid credentials' });

  if (!chef.isApproved) return res.status(401).json({ msg: 'Chef not yet approved' });

  // ✅ Compare hashed approvalPassword
  const isMatch = await require('bcryptjs').compare(approvalPassword, chef.approvalPassword);
  if (!isMatch) {
    return res.status(403).json({ msg: 'Invalid approval password' });
  }

  const token = jwt.sign({ id: chef._id, role: 'chef' }, process.env.JWT_SECRET);
  return res.json({ 
    token, 
     user: {
          _id: chef._id,
          name: chef.name,
          email: chef.email,
          city: chef.city,
          role: 'chef' // ✅ added this line
     }
  });
}


    if (role === 'admin') {
      const admin = await Admin.findOne({ email });
      if (!admin || admin.password !== password) return res.status(400).json({ msg: 'Invalid credentials' });

      const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET);
      return res.json({ token });
    }

    return res.status(400).json({ msg: "Invalid role" });

  } catch (err) {
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
};
