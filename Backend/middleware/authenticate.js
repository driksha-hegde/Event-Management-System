const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    console.log("🛠 Authorization Header:", authHeader); 

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No token provided");
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; 
    console.log("🔑 Extracted Token:", token); 

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decoded); 

    
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("❌ User not found in database");
      return res.status(401).json({ message: "Unauthorized: User does not exist" });
    }

    req.user = user; 
    next();
  } catch (error) {
    console.error("❌ JWT Verification Error:", error.message);
    return res.status(401).json({ message: "Invalid Token", error: error.message });
  }
};

