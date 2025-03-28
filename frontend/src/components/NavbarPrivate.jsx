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
    name: "",
    dateTime: "",
    location: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  // Convert local datetime to UTC format
  const formatDateTimeToUTC = (localDateTime) => {
    const date = new Date(localDateTime);
    return date.toISOString(); // Convert to UTC (ISO 8601)
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

    const formattedEventData = {
      ...eventData,
      dateTime: formatDateTimeToUTC(eventData.dateTime), // Convert datetime to UTC
    };

    try {
      const response = await api.post("/events/create", formattedEventData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Event Created:", response.data);

      // Reset form
      setEventData({ name: "", dateTime: "", location: "", description: "" });

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
                  <label className="form-label">Event Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter event name"
                    value={eventData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date & Time</label>
                  <input
                    type="datetime-local"
                    name="dateTime"
                    className="form-control"
                    value={eventData.dateTime}
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
