const express = require("express");
const router = express.Router();
const {
  getRegistrationReport,
  getEventPerformance,
} = require("../controllers/reportController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// Route: GET /api/reports/registration
router.get("/registration", authenticate(), authorize(["admin"]), getRegistrationReport);

// Route: GET /api/reports/event-performance
router.get("/event-performance", authenticate(), authorize(["admin", "event_manager"]), getEventPerformance);

module.exports = router;
