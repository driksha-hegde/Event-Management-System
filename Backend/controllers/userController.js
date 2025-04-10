const User = require("../models/User");
const bcrypt = require("bcryptjs");

//  Get User Profile
exports.getProfile = async (req, res) => {
    try {
        console.log("🔍 Fetching profile for user ID:", req.user?.id);

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized. User not found in request." });
        }

        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            console.log("❌ User not found in DB");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("✅ User profile found:", user);
        res.json(user);
    } catch (error) {
        console.error("❌ Error fetching profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update Profile (Username, Email)
exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const userId = req.user.id;

        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) return res.status(400).json({ message: "Email already in use" });
        }

        user.username = username || user.username;
        user.email = email || user.email;

        await user.save();

        res.json({ message: "Profile updated successfully!", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update Password
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current and new password are required" });
        }

        
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ message: "Password updated successfully. Please log in again." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update User Role (Admin Only)
exports.updateUserRole = async (req, res) => {
    try {
      const { userId, newRole } = req.body;
  
      
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Only admins can update roles" });
      }
  
      
      const validRoles = ["attendee", "event_manager", "admin"];
      if (!validRoles.includes(newRole)) {
        return res.status(400).json({ message: "Invalid role provided" });
      }
  
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      
      user.role = newRole;
      await user.save();
  
      res.status(200).json({
        message: `✅ User role updated to ${newRole}`,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("❌ Error updating role:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

