const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// ✅ Check if JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  console.error("❌ ERROR: JWT_SECRET is not defined in .env file");
  process.exit(1);
}

// ✅ Middleware Setup
app.use(cors());
app.use(express.json()); // Proper JSON parsing
app.use(bodyParser.json()); // Additional parsing for safety

// Error handling for invalid JSON requests
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("❌ Invalid JSON received:", err.message);
    return res.status(400).json({ message: "Invalid JSON format" });
  }
  next();
});

// ✅ Connect to Database
connectDB();

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the Event Management System API!");
});

// ✅ Handle 404 Errors
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
