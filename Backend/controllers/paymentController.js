const { createPaymentIntent } = require("../utils/payment");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Function to initiate payment
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

// Webhook to handle Stripe events
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

  let event;

  try {
    // Verify the webhook signature to ensure it's coming from Stripe
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`❌ Webhook Signature Verification Failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log("PaymentIntent was successful!", paymentIntent);
      // Here you can update the registration status or database, e.g., mark as paid
      break;

    case "payment_intent.payment_failed":
      const paymentFailure = event.data.object;
      console.log("PaymentIntent failed:", paymentFailure);
      // Handle payment failure (e.g., notify the user or update the database)
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Respond to Stripe that the webhook was received successfully
  res.status(200).send("Event received");
};

module.exports = { initiatePayment, handleStripeWebhook };
