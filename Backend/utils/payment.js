const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (amount, currency, registrationId) => {
  try {
    console.log("🔹 Creating Payment Intent for:", { amount, currency, registrationId });

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { registrationId },
    });

    console.log("✅ Payment Intent Created:", paymentIntent.id);
    return paymentIntent.client_secret;
  } catch (error) {
    console.error("❌ Stripe Payment Intent Error:", error);
    return null; // Return null if an error occurs
  }
};

module.exports = { createPaymentIntent };
