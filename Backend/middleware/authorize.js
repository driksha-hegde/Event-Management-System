module.exports = (req, res, next) => {
    if (req.user.role !== "event_manager") {
      return res.status(403).json({ message: "Only event managers can create events" });
    }
    next();
  };
  