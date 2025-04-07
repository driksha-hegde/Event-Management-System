import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import EventList from "../components/EventList";
import { motion } from "framer-motion";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      }
    };

    fetchEvents();

    // ✅ Listen for new events
    const handleNewEvent = (e) => {
      setEvents((prevEvents) => [...prevEvents, e.detail]);
    };

    window.addEventListener("eventCreated", handleNewEvent);

    return () => {
      window.removeEventListener("eventCreated", handleNewEvent);
    };
  }, []);

  return (
    <div className="fullscreen-background">
      <div className="overlay"></div>

      <motion.div
        className="dashboard-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <h2 className="fw-bold text-light">Welcome, {user?.username}!</h2>
        <p className="text-light small">
          Role: <span className="text-warning fw-semibold">{user?.role}</span>
        </p>

        <h4 className="mt-4 text-light">Upcoming Events</h4>
        <div className="event-list-container">
          <EventList events={events} setEventList={setEvents} userRole={user?.role} />
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
