const Feedback = require('../models/Feedback');

// POST: Submit Feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newFeedback = new Feedback({ name, email, message });
    await newFeedback.save();
    res.status(201).json({ msg: 'Feedback submitted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// GET: All Feedbacks (for admin)
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// PUT: Accept/Reject Feedback
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Feedback.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
