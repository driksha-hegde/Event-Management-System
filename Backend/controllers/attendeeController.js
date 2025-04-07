const Registration = require("../models/Registration");
const Event = require("../models/Event");

// ✅ Check-in Controller
exports.checkInAttendee = async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId } = req.params;

    const registration = await Registration.findOne({
      user: userId,
      event: eventId,
      paymentStatus: "completed",
    });

    if (!registration) {
      return res.status(404).json({
        message: "You are not registered for this event or payment is incomplete.",
      });
    }

    if (registration.checkInTime) {
      return res.status(400).json({ message: "You have already checked in." });
    }

    registration.checkInTime = new Date();
    await registration.save();

    res.status(200).json({
      message: "Check-in successful",
      checkInTime: registration.checkInTime,
    });
  } catch (err) {
    console.error("Check-in Error:", err);
    res.status(500).json({ message: "Server error during check-in." });
  }
};

// ✅ Check-out Controller
exports.checkOutAttendee = async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId } = req.params;

    const registration = await Registration.findOne({
      user: userId,
      event: eventId,
      paymentStatus: "completed",
    });

    if (!registration) {
      return res.status(404).json({
        message: "You are not registered for this event or payment is incomplete.",
      });
    }

    if (!registration.checkInTime) {
      return res.status(400).json({ message: "You must check in before checking out." });
    }

    if (registration.checkOutTime) {
      return res.status(400).json({ message: "You have already checked out." });
    }

    registration.checkOutTime = new Date();
    await registration.save();

    res.status(200).json({
      message: "Check-out successful",
      checkOutTime: registration.checkOutTime,
    });
  } catch (err) {
    console.error("Check-out Error:", err);
    res.status(500).json({ message: "Server error during check-out." });
  }
};

// ✅ Get attendees for an event (admin or event manager who created it)
exports.getEventAttendees = async (req, res) => {
  try {
    const { eventId } = req.params;
    const user = req.user;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 🔐 Debug logs
    console.log("🔐 Checking Access Control:");
    console.log("➡️ Logged-in User ID:   ", user._id.toString());
    console.log("➡️ Event Created By ID: ", event.createdBy.toString());
    console.log("➡️ User Role:           ", user.role);

    // ✅ Only allow admin or the event manager who created it
    if (
      user.role === "event_manager" &&
      String(event.createdBy) !== String(user._id)
    ) {
      return res.status(403).json({ message: "Forbidden: You do not have access" });
    }

    const attendees = await Registration.find({
      event: eventId,
      paymentStatus: "completed",
    })
      .populate("user", "username email role")
      .select("-paymentIntentId");

    res.status(200).json({ event: event.title, attendees });
  } catch (err) {
    console.error("🔥 Get Attendees Error:", err);
    res.status(500).json({ message: "Server error retrieving attendees." });
  }
};
// ✅ Get all events the logged-in attendee has registered for
exports.getMyRegisteredEvents = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const registrations = await Registration.find({ user: userId })
        .populate("event")
        .sort({ createdAt: -1 });
  
      const formatted = registrations.map((reg) => ({
        _id: reg._id,
        event: {
          _id: reg.event._id,
          title: reg.event.title,
          date: reg.event.date,
          location: reg.event.location,
          description: reg.event.description,
        },
        checkInTime: reg.checkInTime,
        checkOutTime: reg.checkOutTime,
        paymentStatus: reg.paymentStatus,
      }));
  
      res.status(200).json({ events: registrations });
    } catch (err) {
      console.error("🚨 Error fetching registered events:", err);
      res.status(500).json({ message: "Server error fetching registered events." });
    }
  };
  