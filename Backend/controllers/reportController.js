const Registration = require("../models/Registration");
const User = require("../models/User");
const Event = require("../models/Event");

// GET /api/reports/registration
exports.getRegistrationReport = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("event", "title date")
      .populate("user", "role");

    const totalRegistrations = registrations.length;
    const paymentStatusCounts = { pending: 0, completed: 0, failed: 0 };
    const roleCounts = { attendee: 0, event_manager: 0, admin: 0 };

    registrations.forEach((reg) => {
      // Count payment status
      if (paymentStatusCounts[reg.paymentStatus] !== undefined) {
        paymentStatusCounts[reg.paymentStatus]++;
      }

      // Count user role
      if (reg.user && roleCounts[reg.user.role] !== undefined) {
        roleCounts[reg.user.role]++;
      }
    });

    res.status(200).json({
      totalRegistrations,
      paymentStatusCounts,
      roleCounts,
      registrations,
    });
  } catch (err) {
    console.error("❌ Error generating report:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/reports/event-performance
exports.getEventPerformance = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("event", "title date")
      .populate("user", "role");

    const eventMap = {};

    registrations.forEach((reg) => {
      const eventId = reg.event._id;

      if (!eventMap[eventId]) {
        eventMap[eventId] = {
          title: reg.event.title,
          date: reg.event.date,
          totalRegistrations: 0,
          checkIns: 0,
        };
      }

      eventMap[eventId].totalRegistrations++;
      if (reg.checkInTime) {
        eventMap[eventId].checkIns++;
      }
    });

    const performance = Object.values(eventMap).map((event) => ({
      ...event,
      attendanceRate:
        event.totalRegistrations === 0
          ? 0
          : ((event.checkIns / event.totalRegistrations) * 100).toFixed(2),
    }));

    res.status(200).json(performance);
  } catch (error) {
    console.error("❌ Error generating event performance report:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
