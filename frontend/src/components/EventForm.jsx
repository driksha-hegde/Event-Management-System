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
    registrationFee: "", // Allow empty input for better UX
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow an empty string while typing, but convert valid numbers properly
    setFormData({
      ...formData,
      [name]: name === "registrationFee" ? (value === "" ? "" : Number(value)) : value,
    });
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
        registrationFee: formData.registrationFee === "" ? 0 : Number(formData.registrationFee), // Convert properly
      };

      console.log("Submitting event:", eventData); // Debugging log

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
        registrationFee: "", // Reset to empty for better UX
      });

      onEventCreated(response.data);
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

      {/* Fixed Registration Fee Field */}
      <div className="mb-2 form-group">
        <label className="form-label fw-bold">Registration Fee (₹)</label>
        <input
          type="number"
          name="registrationFee"
          className="form-control rounded-3"
          value={formData.registrationFee}
          onChange={handleChange}
          min="0"
          step="0.01"
          placeholder="Enter amount (₹0 for free event)"
          required
        />
      </div>

      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? "Creating..." : "Create"}
      </button>
    </form>
  );
};

export default EventForm;
