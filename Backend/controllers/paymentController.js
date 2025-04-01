const { createPaymentIntent } = require("../utils/payment");

const initiatePayment = async (req, res) => {
  try {
    const { amount, registrationId } = req.body;
    if (!amount || !registrationId) {
      return res.status(400).json({ message: "Amount and Registration ID are required" });
    }

    console.log("📢 Initiating Payment for Registration:", registrationId);

    const clientSecret = await createPaymentIntent(amount, "usd", registrationId);
    if (!clientSecret) {
      return res.status(500).json({ message: "Payment initiation failed", error: "No client secret returned" });
    }

    res.status(200).json({ clientSecret });
  } catch (error) {
    console.error("❌ Payment initiation error:", error);
    res.status(500).json({ message: "Payment initiation failed", error: error.message });
  }
};

const handleStripeWebhook = async (req, res) => {
  // Your webhook handling logic
};

module.exports = { initiatePayment, handleStripeWebhook };
