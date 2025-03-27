const express = require("express");
const { register, login, getAllUsers } = require("../controllers/authController");

const router = express.Router();

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

// Get all users route
router.get("/users", getAllUsers);

module.exports = router;