const Feedback = require("../models/Feedback");

exports.submitFeedback = async (req, res) => {
  try {
    const { eventId, rating, comment } = req.body;
    const user = req.user;

    
    if (!user || !user.id || !user.role) {
      return res.status(401).json({ message: "Unauthorized: Missing user info" });
    }

    
    if (user.role !== "attendee") {
      return res.status(403).json({ message: "Only attendees can submit feedback." });
    }

    
    const existingFeedback = await Feedback.findOne({ event: eventId, user: user.id });
    if (existingFeedback) {
      return res.status(400).json({ message: "You have already submitted feedback for this event." });
    }

    
    const feedback = await Feedback.create({
      event: eventId,
      user: user.id,
      rating,
      comment,
    });

    res.status(201).json(feedback);
  } catch (err) {
    console.error("❌ Feedback error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getEventFeedbackStats = async (req, res) => {
  try {
    const feedbackData = await Feedback.aggregate([
      {
        $group: {
          _id: "$event",
          averageRating: { $avg: "$rating" },
          totalFeedbacks: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "eventDetails",
        },
      },
      { $unwind: "$eventDetails" },
      {
        $project: {
          _id: 0,
          eventId: "$eventDetails._id",
          title: "$eventDetails.title",
          date: "$eventDetails.date",
          averageRating: { $round: ["$averageRating", 2] },
          totalFeedbacks: 1,
        },
      },
    ]);

    res.status(200).json(feedbackData);
  } catch (err) {
    console.error("❌ Feedback stats error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("event", "title date").populate("user", "username");

    res.status(200).json(feedbacks);
  } catch (err) {
    console.error("❌ Error fetching feedback:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

