import api from "../utils/axiosInstance";
import { useState } from "react";

const EventForm = ({ onEventCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token); // Debugging token

      // Ensure date format is correct (YYYY-MM-DD)
      const formattedDate = new Date(formData.date).toISOString().split("T")[0];

      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formattedDate, // Ensure correct format
        time: formData.time,
        location: formData.location.trim(),
      };

      console.log("Event Data being sent:", eventData); // Debugging

      const response = await api.post("/events/create", eventData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Event Created:", response.data);

      alert("Event created successfully!");
      setSuccess(true);
      setFormData({ title: "", description: "", date: "", time: "", location: "" });
      
      // Notify parent component
      onEventCreated(response.data);
      
      // Close modal after submission
      document.getElementById("closeModalBtn").click();
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      
      if (err.response?.data?.suggestion) {
        const newTime = confirm(
          `${err.response.data.message}\nWould you like to schedule it for ${err.response.data.suggestion}?`
        );
        if (newTime) {
          setFormData({ ...formData, time: err.response.data.suggestion });
        }
      } else {
        alert(err.response?.data?.message || "Failed to create event");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="createEventModal"
      tabIndex="-1"
      aria-labelledby="createEventModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title fw-bold text-primary">Create Event</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="closeModalBtn"
            ></button>
          </div>

          <div className="modal-body">
            {error && <p className="small text-danger">{error}</p>}
            {success && <p className="small text-success">Event created successfully!</p>}

            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="mb-2">
                <label htmlFor="title" className="form-label fw-bold">Event Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter event title"
                  className="form-control rounded-3"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-2">
                <label htmlFor="description" className="form-label fw-bold">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter event details"
                  className="form-control rounded-3"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Date */}
              <div className="mb-2">
                <label htmlFor="date" className="form-label fw-bold">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-control rounded-3"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Time */}
              <div className="mb-2">
                <label htmlFor="time" className="form-label fw-bold">Time</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  className="form-control rounded-3"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Location */}
              <div className="mb-2">
                <label htmlFor="location" className="form-label fw-bold">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Enter event location"
                  className="form-control rounded-3"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold" disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventForm;