const express = require("express");
const router = express.Router();
const {
  checkInAttendee,
  checkOutAttendee,
  getEventAttendees,
  getMyRegisteredEvents, // ✅ Import the controller
} = require("../controllers/attendeeController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

// ✅ Attendee: View their own registered events
router.get("/my-events", authenticate, authorize("attendee"), getMyRegisteredEvents);

// ✅ Attendee Check-in
router.post("/:eventId/checkin", authenticate, authorize("attendee"), checkInAttendee);

// ✅ Attendee Check-out
router.post("/:eventId/checkout", authenticate, authorize("attendee"), checkOutAttendee);

// ✅ Admin/Event Manager: View attendees for an event
router.get("/:eventId", authenticate, authorize("admin", "event_manager"), getEventAttendees);

module.exports = router;
