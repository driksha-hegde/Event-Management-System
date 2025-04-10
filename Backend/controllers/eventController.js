const Event = require("../models/Event");
const mongoose = require("mongoose");

// Create Event (event managers and admin)
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

    
    const existingEvent = await Event.findOne({ date, time, location });

    if (existingEvent) {
      
      const nextAvailableTime = await findNextAvailableTime(date, location);
      return res.status(400).json({
        message: `An event is already scheduled at this location for the given time.`,
        suggestion: `Next available time: ${nextAvailableTime}`,
      });
    }

    
    const newEvent = new Event({ 
      title, 
      date, 
      time, 
      location, 
      description, 
      registrationFee, 
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
  const events = await Event.find({ date, location }).sort({ time: 1 }); 

  let suggestedTime = "09:00"; 

  for (let event of events) {
    let eventEndTime = incrementTime(event.time, 30); 
    if (isTimeAvailable(eventEndTime, events)) {
      return eventEndTime;
    }
  }

  return suggestedTime; 
};


const incrementTime = (timeStr, minutesToAdd) => {
  let [hours, minutes] = timeStr.split(":").map(Number);
  minutes += minutesToAdd;

  if (minutes >= 60) {
    hours += 1;
    minutes -= 60;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};


const isTimeAvailable = (time, events) => {
  return !events.some(event => event.time === time);
};

//  Get All Events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
};

//  Get Single Event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "name email");
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error: error.message });
  }
};

// Update Event (Only admin can update)
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    console.log("Event createdBy:", event.createdBy.toString());
    console.log("User trying to update:", req.user._id);
    console.log("User role:", req.user.role);

    
    if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this event" });
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error: error.message });
  }
};



// Delete Event (Only admin can delete)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    console.log("Event createdBy:", event.createdBy.toString());
    console.log("User trying to delete:", req.user._id);
    console.log("User role:", req.user.role);

    
    if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this event" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error: error.message });
  }
};


// Get events created by the logged-in event manager
exports.getMyEvents = async (req, res) => {
  try {
    if (req.user.role !== 'event_manager') {
      return res.status(403).json({ message: "Access denied" });
    }

    const myEvents = await Event.find({ createdBy: req.user.id });
    res.status(200).json(myEvents);
  } catch (error) {
    console.error("Error fetching my events:", error);
    res.status(500).json({ message: "Server error" });
  }
};


