const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// ✅ Check if essential environment variables are set
if (!process.env.JWT_SECRET) {
  console.error("❌ ERROR: JWT_SECRET is missing in the .env file.");
  process.exit(1);
}

// ✅ Initialize Express app
const app = express();

// ✅ Connect to the database before using routes
connectDB();



// ✅ Middleware
app.use(cors());
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json()); // JSON body parsing

// ✅ Error handling for invalid JSON requests
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("❌ Invalid JSON received:", err.message);
    return res.status(400).json({ message: "Invalid JSON format" });
  }
  next();
});

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/registrations", require("./routes/registrationRoutes"));

// ✅ Default API Route
app.get("/", (req, res) => {
  res.send("✅ Welcome to the Event Management System API!");
});

// ✅ Handle 404 Errors (Unknown Routes)
app.use((req, res) => {
  res.status(404).json({ message: "❌ Route not found" });
});

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
