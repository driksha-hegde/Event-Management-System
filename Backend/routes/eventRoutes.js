const express = require("express");
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents, // ✅ You forgot this import
} = require("../controllers/eventController");

const authenticate = require("../middleware/authenticate");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Get events created by the logged-in event manager (important: this comes BEFORE /:id)
router.get("/my-events", authenticate, getMyEvents);

// ✅ Create Event - Only Event Managers and Admins
router.post("/create", authenticate, authMiddleware(["event_manager", "admin"]), createEvent);

// ✅ Get single event by ID
router.get("/:id", authenticate, authMiddleware(["event_manager", "admin"]), getEventById);

// ✅ Update event by ID - Only creator or admin
router.put("/:id", authenticate, authMiddleware(["event_manager", "admin"]), updateEvent);

// ✅ Delete event by ID - Only creator or admin
router.delete("/:id", authenticate, authMiddleware(["event_manager", "admin"]), deleteEvent);

// ✅ Get All Events
router.get("/", authenticate, getAllEvents);

module.exports = router;
