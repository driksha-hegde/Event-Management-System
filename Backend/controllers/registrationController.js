const Registration = require("../models/Registration");
const Event = require("../models/Event");
const User = require("../models/User");

// ✅ Register for an event
exports.registerForEvent = async (req, res) => {
    try {
        const { eventId, name, email, phone } = req.body;
        const userId = req.user.id;

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        // Prevent duplicate registrations
        const existingRegistration = await Registration.findOne({ event: eventId, user: userId });
        if (existingRegistration) return res.status(400).json({ message: "User already registered for this event" });

        // Create new registration
        const registration = new Registration({
            event: eventId,
            user: userId,
            name,
            email,
            phone,
            paymentStatus: "pending"
        });

        await registration.save();
        res.status(201).json({ message: "Registration successful", registration });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Get all registrations
exports.getAllRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find().populate("event user", "name email");
        if (!registrations.length) return res.status(404).json({ message: "No registrations found" });

        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Get registrations for a specific event
exports.getRegistrationsByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const registrations = await Registration.find({ event: eventId }).populate("user", "name email");
        if (!registrations.length) return res.status(404).json({ message: "No registrations found for this event" });

        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};