const express = require("express");
const router = express.Router();
const { 
  registerForEvent, 
  getAllRegistrations, 
  getRegistrationsByEvent 
} = require("../controllers/registrationController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

// ✅ Register for an event
router.post("/register", authenticate, authorize(["attendee", "admin"]), registerForEvent);

// ✅ Get all registrations (Admin only)
router.get("/all", authenticate, authorize(["admin"]), getAllRegistrations);

// ✅ Get registrations for a specific event (Admin only)
router.get("/:eventId", authenticate, authorize(["admin"]), getRegistrationsByEvent);

module.exports = router; // ✅ Ensure this exports `router`
