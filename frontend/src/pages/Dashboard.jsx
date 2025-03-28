import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import EventForm from "../components/EventForm"; // ✅ Correct import

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    // Fetch events
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      }
    };
    fetchEvents();
  }, []);

  const handleEventCreated = (newEvent) => {
    setEvents([...events, newEvent]); // Update state when a new event is created
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold">Welcome, {user?.name}</h2>
      <p className="text-muted">Role: {user?.role}</p>

      {user?.role === "event_manager" && (
        <div className="mb-4">
          <EventForm onEventCreated={handleEventCreated} /> {/* ✅ Correct component usage */}
        </div>
      )}

      <h4 className="mt-4">Upcoming Events</h4>
      <ul className="list-group">
        {events.length > 0 ? (
          events.map((event) => (
            <li key={event._id} className="list-group-item">
              <h5>{event.title}</h5>
              <p>{event.description}</p>
              <small>{event.date} at {event.time}</small>
              <br />
              <small>Location: {event.location}</small>
            </li>
          ))
        ) : (
          <p>No events available</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
