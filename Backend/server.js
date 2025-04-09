const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { handleStripeWebhook } = require("./controllers/paymentController");

dotenv.config();

// ✅ Check ENV variables
if (!process.env.JWT_SECRET) {
  console.error("❌ ERROR: JWT_SECRET is missing in the .env file.");
  process.exit(1);
}
if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_ENDPOINT_SECRET) {
  console.error("❌ ERROR: Missing Stripe environment variables.");
  process.exit(1);
}

const app = express();

// ✅ Connect to DB
connectDB();

// ✅ Enable CORS
app.use(cors());

// ✅ Stripe Webhook (must be before express.json())
app.post("/api/payments/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

// ✅ Body parser (after webhook)
app.use(express.json());

// ✅ Environment variable logs (for debug)
console.log("✅ STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY ? "Loaded" : "❌ Missing");
console.log("✅ STRIPE_ENDPOINT_SECRET:", process.env.STRIPE_ENDPOINT_SECRET ? "Loaded" : "❌ Missing");

// ✅ Error handling for invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("❌ Invalid JSON received:", err.message);
    return res.status(400).json({ message: "Invalid JSON format" });
  }
  next();
});

// ✅ API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/registrations", require("./routes/registrationRoutes"));
app.use("/api/attendees", require("./routes/attendeeRoutes")); // ✅ Added attendee routes
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));

// ✅ Default + 404
app.get("/", (req, res) => {
  res.send("✅ Welcome to the Event Management System API!");
});
app.use((req, res) => {
  res.status(404).json({ message: "❌ Route not found" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
