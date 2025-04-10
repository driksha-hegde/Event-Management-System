const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        
        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        
        const validRoles = ["admin", "attendee", "event_manager"];
        if (!validRoles.includes(role.toLowerCase())) {
            return res.status(400).json({ message: "Invalid role selected" });
        }

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        
        user = new User({ username, email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ message: "User registered successfully", user: { username, email, role } });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Login a user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({
            message: "Login successful",
            token,
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password"); 
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};


