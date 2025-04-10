const express = require("express");
const {
  getProfile,
  updateProfile,
  updatePassword,
  updateUserRole, 
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize"); 

const router = express.Router();

//  Authenticated routes
router.get("/profile", authMiddleware(), getProfile);
router.put("/profile", authMiddleware(), updateProfile);
router.put("/password", authMiddleware(), updatePassword);

// Admin-only route to update any user's role
router.put("/update-role", authMiddleware(), authorize(["admin"]), updateUserRole);

module.exports = router;
