const express = require("express");
const authenticate = require("../middleware/authenticate");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Admin Dashboard
router.get("/admin", authenticate, authMiddleware(["admin"]), (req, res) => {
    res.json({ message: `Welcome, Admin!` });
});

// Event Manager Dashboard
router.get("/event-manager", authenticate, authMiddleware(["event_manager"]), (req, res) => {
    res.json({ message: `Welcome, Event Manager!` });
});

// Attendee Dashboard
router.get("/attendee", authenticate, authMiddleware(["attendee"]), (req, res) => {
    res.json({ message: `Welcome, Attendee` });
});

module.exports = router;
