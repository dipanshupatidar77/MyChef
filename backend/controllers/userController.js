
const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// PUT /api/users/profile
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // 👈 comes from protectUser middleware

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update fields (not email)
    user.name = req.body.name || user.name;
    user.location=req.body.location|| user.location,
    user.city = req.body.city || user.city;
    user.profilePicUrl = req.body.profilePicUrl || user.profilePicUrl;

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error.message);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};
