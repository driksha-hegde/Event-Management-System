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

      // Convert date to correct format
      const formattedDate = new Date(formData.date);

      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formattedDate, // Ensures Date format is correct
        time: formData.time,
        location: formData.location,
      };

      const response = await api.post("/events/create", eventData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Event Created:", response.data); // Debugging API response

      setSuccess(true);
      setFormData({ title: "", description: "", date: "", time: "", location: "" });

      // Notify parent component
      onEventCreated(response.data);

      // Close modal after submission
      document.getElementById("closeModalBtn").click();
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to create event");
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
              <div className="mb-2">
                <input
                  type="text"
                  name="title"
                  placeholder="Event Title"
                  className="form-control rounded-3"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2">
                <textarea
                  name="description"
                  placeholder="Description"
                  className="form-control rounded-3"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2">
                <input
                  type="date"
                  name="date"
                  className="form-control rounded-3"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2">
                <input
                  type="time"
                  name="time"
                  className="form-control rounded-3"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  className="form-control rounded-3"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
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
