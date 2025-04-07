import React, { useEffect, useState } from "react";
import axios from "axios";

const RegisteredEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/attendees/my-events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("📦 Registered Events Response:", res.data);

        setEvents(res.data.events || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load registered events.");
        setLoading(false);
        console.error("❌ Fetch Error:", err);
      }
    };

    fetchRegisteredEvents();
  }, []);

  if (loading) return <p>Loading your registered events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Your Registered Events</h2>
      {events.length === 0 ? (
        <p>You haven’t registered for any events yet.</p>
      ) : (
        <ul className="list-group">
          {events.map((registration) => (
            <li className="list-group-item" key={registration._id}>
              <h5>{registration.event.title}</h5>
              <p>{registration.event.description}</p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(registration.event.date).toLocaleString()}
              </p>
              <p>
                <strong>Location:</strong> {registration.event.location}
              </p>
              <p>
                <strong>Check-in:</strong>{" "}
                {registration.checkInTime
                  ? new Date(registration.checkInTime).toLocaleString()
                  : "Not checked in"}
              </p>
              <p>
                <strong>Check-out:</strong>{" "}
                {registration.checkOutTime
                  ? new Date(registration.checkOutTime).toLocaleString()
                  : "Not checked out"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RegisteredEvents;
