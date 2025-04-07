const express = require("express");
const {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
  } = require("../controllers/eventController");
  
const authenticate = require("../middleware/authenticate");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create Event - Only Event Managers
router.post("/create", authenticate, authMiddleware(["event_manager", "admin"]), createEvent);

// Get single event by ID
router.get("/:id", authenticate, authMiddleware(["event_manager", "admin"]), getEventById);

// Update event by ID - Only creator can update
router.put("/:id",  authMiddleware(["event_manager", "admin"]), authenticate, updateEvent);


// Delete event by ID - Only creator can delete

router.delete("/:id", authMiddleware(["event_manager", "admin"]), authenticate, deleteEvent);




// Get All Events
router.get("/", authenticate, getAllEvents);

module.exports = router;
