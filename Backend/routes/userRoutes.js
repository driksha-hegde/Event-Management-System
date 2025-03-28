const express = require("express");
const { getProfile, updateProfile, updatePassword } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Get Profile (Requires Authentication)
router.get("/profile", authMiddleware(), getProfile);

// ✅ Update Profile
router.put("/profile", authMiddleware(), updateProfile);

// ✅ Update Password
router.put("/password", authMiddleware(), updatePassword);

module.exports = router;
