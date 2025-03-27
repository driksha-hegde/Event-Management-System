const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
  try {
    const { name, date, location } = req.body;

    const newEvent = new Event({ name, date, location, createdBy: req.user.id });
    await newEvent.save();

    res.status(201).json({ message: "Event created successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "username email");
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
