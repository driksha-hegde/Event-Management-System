const express = require("express");
const { createEvent, getAllEvents } = require("../controllers/eventController");
const authenticate = require("../middleware/authenticate");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create Event - Only Event Managers
router.post("/create", authenticate, authMiddleware(["event_manager"]), createEvent);

// Get All Events
router.get("/", authenticate, getAllEvents);

module.exports = router;
