const express = require("express");
const { initiatePayment, handleStripeWebhook, confirmPayment } = require("../controllers/paymentController");

const router = express.Router();

// ✅ Route to initiate payment
router.post("/initiate", initiatePayment);

// ✅ Route to handle Stripe webhook
router.post("/webhook", (req, res, next) => {
  express.raw({ type: "application/json" })(req, res, (err) => {
    if (err) {
      console.error("❌ Invalid Webhook Request:", err.message);
      return res.status(400).send("Invalid Webhook Request");
    }
    next();
  });
}, handleStripeWebhook);

// ✅ Route to confirm payment and update status in MongoDB
router.post("/success", confirmPayment);

module.exports = router;
