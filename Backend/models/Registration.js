const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },
  paymentIntentId: { type: String }, // ✅ To store Stripe's payment intent ID
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Registration", registrationSchema);


