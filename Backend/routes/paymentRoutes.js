const express = require("express");
const { initiatePayment } = require("../controllers/paymentController");

const router = express.Router();

// ✅ Route to initiate a payment
router.post("/initiate", initiatePayment);

module.exports = router;

