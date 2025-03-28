const Event = require("../models/Event");
const mongoose = require("mongoose");
// ✅ Create Event (Only event managers)
exports.createEvent = async (req, res) => {
  try {
      console.log("📩 Incoming Request Body:", req.body);
      console.log("👤 Authenticated User:", req.user);

      if (!req.user) {
          console.log("❌ Unauthorized: No user found in req");
          return res.status(401).json({ message: "Unauthorized: No user found" });
      }

      if (req.user.role !== "event_manager") {
          console.log("❌ Forbidden: Only event managers can create events");
          return res.status(403).json({ message: "Only event managers can create events" });
      }

      const { title, description, date, time, location } = req.body;
      const newEvent = new Event({
          title,
          description,
          date,
          time,
          location,
          createdBy: req.user.id // ✅ Use `req.user.id` from the token!
      });

      await newEvent.save();
      res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
      console.error("❌ Error Creating Event:", error);
      res.status(500).json({ message: "Error creating event", error: error.message });
  }
};



// ✅ Get All Events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
};

// ✅ Get Single Event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "name email");
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error: error.message });
  }
};

// ✅ Update Event (Only the creator can update)
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized to update this event" });
    }

    Object.assign(event, req.body);
    await event.save();
    res.json({ message: "Event updated successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error: error.message });
  }
};

// ✅ Delete Event (Only the creator can delete)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized to delete this event" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error: error.message });
  }
};
