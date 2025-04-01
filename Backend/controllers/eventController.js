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

    if (req.user.role !== "event_manager" && req.user.role !== "admin") {
      console.log("❌ Forbidden: Only event managers and admins can create events");
      return res.status(403).json({ message: "Only event managers and admins can create events" });
    }

    const { title, date, time, location, description, registrationFee } = req.body;

    // Check if an event exists at the same location, date, and time
    const existingEvent = await Event.findOne({ date, time, location });

    if (existingEvent) {
      // Suggest next available time slots (e.g., 30-minute gaps)
      const nextAvailableTime = await findNextAvailableTime(date, location);
      return res.status(400).json({
        message: `An event is already scheduled at this location for the given time.`,
        suggestion: `Next available time: ${nextAvailableTime}`,
      });
    }

    // If no conflict at the same location, create the event
    const newEvent = new Event({ 
      title, 
      date, 
      time, 
      location, 
      description, 
      registrationFee, // Include registrationFee in the new event
      createdBy: req.user.id 
    });
    await newEvent.save();

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error });
  }
};

// Function to find the next available time slot
const findNextAvailableTime = async (date, location) => {
  const events = await Event.find({ date, location }).sort({ time: 1 }); // Get all events sorted by time

  let suggestedTime = "09:00"; // Default start time

  for (let event of events) {
    let eventEndTime = incrementTime(event.time, 30); // Assume each event is 30 minutes long
    if (isTimeAvailable(eventEndTime, events)) {
      return eventEndTime;
    }
  }

  return suggestedTime; // If no conflicts, return default time
};

// Helper function to add minutes to a time string (HH:mm)
const incrementTime = (timeStr, minutesToAdd) => {
  let [hours, minutes] = timeStr.split(":").map(Number);
  minutes += minutesToAdd;

  if (minutes >= 60) {
    hours += 1;
    minutes -= 60;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

// Helper function to check if a time slot is available
const isTimeAvailable = (time, events) => {
  return !events.some(event => event.time === time);
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

    // Include registrationFee in the update
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
