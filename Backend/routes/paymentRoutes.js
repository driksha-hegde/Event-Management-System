const express = require("express");
const { initiatePayment, handleStripeWebhook } = require("../controllers/paymentController");

const router = express.Router();

// ✅ Route to initiate payment
router.post("/initiate", initiatePayment);

// ✅ Route to handle Stripe webhook
router.post("/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

module.exports = router;
