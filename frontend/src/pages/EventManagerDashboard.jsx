import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EventManagerDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", description: "", date: "", location: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events/my-events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data);
      } catch (error) {
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [navigate]);

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleCreateEvent = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.post("http://localhost:5000/api/events", newEvent, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      setEvents([...events, response.data]); // Update UI after adding event
      setNewEvent({ title: "", description: "", date: "", location: "" }); // Clear form
    } catch (error) {
      setError("Failed to create event.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-primary text-center">Event Manager Dashboard</h2>

      {/* Navigation */}
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-outline-secondary me-2" onClick={() => navigate("/profile")}>Profile</button>
        <button className="btn btn-danger" onClick={() => { localStorage.clear(); navigate("/"); }}>Logout</button>
      </div>

      {/* Create Event Form */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5>Create New Event</h5>
        <input type="text" name="title" placeholder="Event Title" className="form-control mb-2" value={newEvent.title} onChange={handleInputChange} />
        <textarea name="description" placeholder="Description" className="form-control mb-2" value={newEvent.description} onChange={handleInputChange} />
        <input type="datetime-local" name="date" className="form-control mb-2" value={newEvent.date} onChange={handleInputChange} />
        <input type="text" name="location" placeholder="Location" className="form-control mb-2" value={newEvent.location} onChange={handleInputChange} />
        <button className="btn btn-success" onClick={handleCreateEvent}>Create Event</button>
      </div>

      {/* Loading/Error Messages */}
      {loading ? <p>Loading events...</p> : error ? <p className="text-danger">{error}</p> : null}

      {/* Event List */}
      <div className="row">
        {events.map((event) => (
          <div key={event._id} className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{event.title}</h5>
                <p className="card-text">{event.description}</p>
                <p className="text-muted">{new Date(event.date).toLocaleString()}</p>
                <p><strong>Location:</strong> {event.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventManagerDashboard;
