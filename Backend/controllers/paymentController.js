const { createPaymentIntent } = require("../utils/payment");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Registration = require("../models/Registration"); // ✅ Adjust the path if needed

// ✅ Function to initiate payment
const initiatePayment = async (req, res) => {
  try {
    const { amount, registrationId } = req.body;
    if (!amount || !registrationId) {
      return res.status(400).json({ message: "❌ Amount and Registration ID are required" });
    }

    console.log("📢 Initiating Payment for Registration:", registrationId);

    const clientSecret = await createPaymentIntent(amount, "usd", registrationId);
    if (!clientSecret) {
      return res.status(500).json({ message: "❌ Payment initiation failed", error: "No client secret returned" });
    }

    res.status(200).json({ clientSecret });
  } catch (error) {
    console.error("❌ Payment initiation error:", error);
    res.status(500).json({ message: "❌ Payment initiation failed", error: error.message });
  }
};

// ✅ Webhook to handle Stripe events
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`❌ Webhook Signature Verification Failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log("✅ PaymentIntent was successful!", paymentIntent);

      // ✅ Extract metadata (registrationId)
      const registrationId = paymentIntent.metadata.registrationId;
      if (!registrationId) {
        console.error("❌ No registrationId found in payment metadata");
        return res.status(400).send("Missing registrationId in metadata");
      }

      // ✅ Update the payment status in MongoDB
      try {
        const updatedRegistration = await Registration.findByIdAndUpdate(
          registrationId,
          { paymentStatus: "successful", paymentIntentId: paymentIntent.id },
          { new: true }
        );

        if (!updatedRegistration) {
          console.error("❌ Registration not found for ID:", registrationId);
          return res.status(404).send("Registration not found");
        }

        console.log("✅ Payment status updated in MongoDB:", updatedRegistration);
      } catch (error) {
        console.error("❌ Error updating registration:", error);
        return res.status(500).send("Internal Server Error");
      }
      break;

    case "payment_intent.payment_failed":
      console.log("❌ PaymentIntent failed:", event.data.object);
      break;

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  res.status(200).send("Event received");
};

// ✅ Manually Confirm Payment Route
const confirmPayment = async (req, res) => {
  try {
    const { registrationId, paymentIntentId } = req.body;

    if (!registrationId || !paymentIntentId) {
      return res.status(400).json({ message: "❌ Missing required fields" });
    }

    // ✅ Update payment status in MongoDB
    const updatedRegistration = await Registration.findByIdAndUpdate(
      registrationId,
      { paymentStatus: "successful", paymentIntentId },
      { new: true }
    );

    if (!updatedRegistration) {
      return res.status(404).json({ message: "❌ Registration not found" });
    }

    res.json({ message: "✅ Payment status updated successfully", registration: updatedRegistration });
  } catch (error) {
    console.error("❌ Error updating payment status:", error);
    res.status(500).json({ message: "❌ Internal server error" });
  }
};

module.exports = { initiatePayment, handleStripeWebhook, confirmPayment };
