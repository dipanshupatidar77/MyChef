const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getAllFeedbacks,
  updateFeedbackStatus,
} = require('../controllers/feedbackController');

// POST /api/feedback/submit
router.post('/submit', submitFeedback);

// GET /api/feedback/all (admin)
router.get('/admin/feedbacks', getAllFeedbacks);

// PUT /api/feedback/:id/status
router.put('/:id/status', updateFeedbackStatus);

module.exports = router;
