import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";

const NavbarPrivate = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // State for event form
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  // Submit event to backend
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication error! Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const formattedDate = new Date(eventData.date).toISOString().split("T")[0];

      const formattedEventData = {
        title: eventData.title.trim(),
        description: eventData.description.trim(),
        date: formattedDate, // YYYY-MM-DD format
        time: eventData.time,
        location: eventData.location.trim(),
      };

      const response = await api.post("/events/create", formattedEventData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Event Created:", response.data);

      // Reset form
      setEventData({ title: "", description: "", date: "", time: "", location: "" });

      // Close modal
      document.getElementById("closeModalBtn").click();

      alert("Event created successfully!");
    } catch (err) {
      console.error("Error Creating Event:", err.response?.data);
      setError(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">
            Event Management
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/profile">Profile</Link>
              </li>

              {(userRole === "event_manager" || userRole === "admin") && (
                <li className="nav-item">
                  <button
                    className="btn btn-primary btn-xs ms-2"
                    data-bs-toggle="modal"
                    data-bs-target="#createEventModal"
                  >
                    Create Event
                  </button>
                </li>
              )}

              {/* Dashboard Button */}
              <li className="nav-item">
                <button 
                  className="btn btn-warning btn-xs ms-2"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </button>
              </li>

              {/* Logout Button */}
              <li className="nav-item">
                <button
                  className="btn btn-danger btn-xs ms-2"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Create Event Modal */}
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
              <h5 className="modal-title fw-bold text-primary" id="createEventModalLabel">
                Create New Event
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModalBtn"
              ></button>
            </div>
            <div className="modal-body">
              {error && <p className="text-danger small">{error}</p>}

              <form onSubmit={handleCreateEvent}>
                <div className="mb-3">
                  <label className="form-label">Event Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="Enter event title"
                    value={eventData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="3"
                    placeholder="Enter event details"
                    value={eventData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    className="form-control"
                    value={eventData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    name="time"
                    className="form-control"
                    value={eventData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    placeholder="Enter event location"
                    value={eventData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-success w-100" disabled={loading}>
                  {loading ? "Creating..." : "Create Event"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarPrivate;
