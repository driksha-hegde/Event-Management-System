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

  paymentIntentId: { type: String }, 

  
  checkInTime: { type: Date, default: null },
  checkOutTime: { type: Date, default: null },

  createdAt: { type: Date, default: Date.now },
});


registrationSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);
