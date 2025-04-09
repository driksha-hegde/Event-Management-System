const express = require("express");
const router = express.Router();
const { submitFeedback, getEventFeedbackStats, getAllFeedback } = require("../controllers/feedbackController");
const authenticate = require("../middleware/authMiddleware");

// Only attendees can submit feedback
router.post("/", authenticate(["attendee"]), submitFeedback);

// Only admins can view stats
router.get("/stats", authenticate(["admin"]), getEventFeedbackStats);

router.get("/all", authenticate(["admin"]), getAllFeedback);

module.exports = router;
