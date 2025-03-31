import { useState } from "react";
import api from "../utils/axiosInstance";
import "../styles/EventForm.css"; // Make sure this is imported!

const EventForm = ({ onEventCreated, closeModal }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formattedDate = new Date(formData.date).toISOString().split("T")[0];

      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formattedDate,
        time: formData.time,
        location: formData.location.trim(),
      };

      const response = await api.post("/events/create", eventData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Event created successfully!");
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
      });

      // Notify parent component
      onEventCreated(response.data);

      // Close modal
      closeModal();
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form-container">
      <div className="mb-2 form-group">
        <label className="form-label fw-bold">Event Title</label>
        <input
          type="text"
          name="title"
          className="form-control rounded-3"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-2 form-group">
        <label className="form-label fw-bold">Description</label>
        <textarea
          name="description"
          className="form-control rounded-3"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-2 form-group">
        <label className="form-label fw-bold">Date</label>
        <input
          type="date"
          name="date"
          className="form-control rounded-3"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-2 form-group">
        <label className="form-label fw-bold">Time</label>
        <input
          type="time"
          name="time"
          className="form-control rounded-3"
          value={formData.time}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-2 form-group">
        <label className="form-label fw-bold">Location</label>
        <input
          type="text"
          name="location"
          className="form-control rounded-3"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>

      {/* Updated button with correct class for gradient color */}
      <button
        type="submit"
        className="submit-button"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create"}
      </button>
    </form>
  );
};

export default EventForm;
