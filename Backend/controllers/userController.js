const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get User Profile (For Display)
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Exclude password
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update User Profile
// Update User Profile
exports.updateProfile = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const userId = req.user.id;

        // Find the user
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if the new email is already in use (except by the same user)
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) return res.status(400).json({ message: "Email already in use" });
        }

        // Hash new password if provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // Update fields (including role)
        user.username = username || user.username;
        user.email = email || user.email;
        user.role = role || user.role; // ✅ Now updates role

        await user.save();

        // Send response and require re-login
        res.json({ message: "Profile updated successfully. Please log in again." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

