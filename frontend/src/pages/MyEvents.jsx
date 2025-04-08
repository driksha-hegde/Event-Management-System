import React, { useEffect, useState } from "react";
import axios from "axios";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem("token"); // Or however you store your auth token

        const res = await axios.get("http://localhost:5000/api/events/my-events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEvents(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch your events");
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📋 My Created Events</h2>
      {events.length === 0 ? (
        <p>No events created yet.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event._id} className="border rounded p-4 shadow">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Time:</strong> {event.time}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Fee:</strong> ₹{event.registrationFee}</p>
              <p><strong>Description:</strong> {event.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyEvents;
