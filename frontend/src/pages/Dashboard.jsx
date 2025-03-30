import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import EventForm from "../components/EventForm";
import EventList from "../components/EventList"; // ✅ Import EventList

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

      {/* Event Manager can create events */}
      {user?.role === "event_manager" && (
        <div className="mb-4">
          <EventForm onEventCreated={handleEventCreated} />
        </div>
      )}

      <h4 className="mt-4">Upcoming Events</h4>
      
      {/* Use EventList component instead of manually listing events */}
      <EventList events={events} userRole={user?.role} />
    </div>
  );
};

export default Dashboard;
