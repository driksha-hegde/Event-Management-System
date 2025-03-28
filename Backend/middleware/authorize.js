module.exports = (req, res, next) => {
  if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user data found" });
  }

  if (req.user.role !== "event_manager") {
      return res.status(403).json({ message: "Only event managers can create events" });
  }

  // ✅ Ensure `createdBy` is present
  if (!req.body.createdBy) {
      req.body.createdBy = req.user._id;
  }

  next();
};

  