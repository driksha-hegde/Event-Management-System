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

// Update User Profile (Username, Email Only)
exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const userId = req.user.id;

        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if email is already in use (except by the same user)
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) return res.status(400).json({ message: "Email already in use" });
        }

        // Update fields
        user.username = username || user.username;
        user.email = email || user.email;

        await user.save();

        res.json({ message: "Profile updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update User Password

// check this part properly
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ message: "Password updated successfully. Please log in again." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
