import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegisteredEvents.css";

const RegisteredEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("⚠️ No token found. Redirecting to login.");
        navigate("/");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/attendees/my-events", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEvents(res.data.events || []);
      } catch (err) {
        console.error("❌ Fetch Error:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/");
        } else {
          setError("Failed to load registered events.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, [navigate]);

  const handleCheckIn = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/attendees/${eventId}/checkin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { checkInTime } = res.data;

      setEvents((prev) =>
        prev.map((e) =>
          e.event._id === eventId ? { ...e, checkInTime } : e
        )
      );
    } catch (err) {
      console.error("❌ Check-in failed:", err);
      alert("Check-in failed.");
    }
  };

  const handleCheckOut = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/attendees/${eventId}/checkout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { checkOutTime } = res.data;

      setEvents((prev) =>
        prev.map((e) =>
          e.event._id === eventId ? { ...e, checkOutTime } : e
        )
      );
    } catch (err) {
      console.error("❌ Check-out failed:", err);
      alert("Check-out failed.");
    }
  };

  const handleGiveFeedback = (event) => {
    navigate(`/feedback/${event._id}`);
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) return <p className="text-center mt-5">Loading your registered events...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <>
      <div className="registered-events-background"></div>
      <div className="registered-events-overlay"></div>
      <div className="registered-events-card">
        <h2 className="table-title">Your Registered Events</h2>
        {events.length === 0 ? (
          <p className="text-center">You haven’t registered for any events yet.</p>
        ) : (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {events.map((registration) => (
                  <tr key={registration._id}>
                    <td>{registration.event?.title || "N/A"}</td>
                    <td>{registration.event?.description || "N/A"}</td>
                    <td>
                      {registration.event?.date
                        ? formatDateTime(registration.event.date)
                        : "N/A"}
                    </td>
                    <td>{registration.event?.location || "N/A"}</td>
                    <td>
                      {registration.checkInTime ? (
                        formatDateTime(registration.checkInTime)
                      ) : (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleCheckIn(registration.event._id)}
                        >
                          Check In
                        </button>
                      )}
                    </td>
                    <td>
                      {registration.checkOutTime ? (
                        formatDateTime(registration.checkOutTime)
                      ) : (
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleCheckOut(registration.event._id)}
                          disabled={!registration.checkInTime}
                        >
                          Check Out
                        </button>
                      )}
                    </td>
                    <td>
                      {registration.checkOutTime ? (
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => handleGiveFeedback(registration.event)}
                        >
                          Give Feedback
                        </button>
                      ) : (
                        <button className="btn btn-secondary btn-sm" disabled>
                          Give Feedback
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default RegisteredEvents;
