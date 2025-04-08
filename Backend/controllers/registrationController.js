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

        // ✅ Determine payment status
        const isFree = event.registrationFee === 0;

        // Create registration
        const registration = new Registration({
            event: eventId,
            user: userId,
            name,
            email,
            phone,
            paymentStatus: isFree ? "completed" : "pending"
        });

        await registration.save();

        res.status(201).json({ message: "Registration successful", registration });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Get all registrations
// ✅ Get all registrations
exports.getAllRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find()
            .populate("event", "title date location") // added 'location'
            .populate("user", "email");

        if (!registrations.length) {
            return res.status(404).json({ message: "No registrations found" });
        }

        // ✅ FIXED: Wrap the response properly for frontend
        res.status(200).json({ registrations });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// ✅ Get registrations for a specific event
exports.getRegistrationsByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const registrations = await Registration.find({ event: eventId })
            .populate("user", "name email");

        if (!registrations.length) {
            return res.status(404).json({ message: "No registrations found for this event" });
        }

        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Get attendees for a specific event (used by Event Manager/Admin)
exports.getAttendeesByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const attendees = await Registration.find({ event: eventId })
            .populate("user", "name email role")
            .select("name email phone checkInTime checkOutTime");

        if (!attendees.length) {
            return res.status(404).json({ message: "No attendees found for this event" });
        }

        res.status(200).json({ attendees });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

