import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyEvents.css";
import { useNavigate } from "react-router-dom";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/events/my-events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Events received:", res.data);
        setEvents(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to fetch your events");
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  const handleViewAttendees = (eventId) => {
    navigate(`/my-attendees/${eventId}`);
  };

  return (
    <div>
      <div className="my-events-background"></div>
      <div className="my-events-overlay"></div>

      <div className="my-events-card">
        <h2 className="table-title">My Created Events</h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : events.length === 0 ? (
          <p className="text-center">No events created yet.</p>
        ) : (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Fee (₹)</th>
                  <th>Description</th>
                  <th>Attendees</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id}>
                    <td>{event.title}</td>
                    <td>{event.date}</td>
                    <td>{event.time}</td>
                    <td>{event.location}</td>
                    <td>{event.registrationFee}</td>
                    <td>{event.description}</td>
                    <td>
                      <button
                        className="view-attendees-btn btn"
                        onClick={() => handleViewAttendees(event._id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
