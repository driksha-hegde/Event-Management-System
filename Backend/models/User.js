const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ["admin", "participant", "event manager"], 
      required: true, 
      default: "participant" // Default role is "participant"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);