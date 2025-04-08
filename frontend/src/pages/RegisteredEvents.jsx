import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegisteredEvents.css"; // Make sure this CSS file exists

const RegisteredEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      const token = localStorage.getItem("token");

      // 🔒 Redirect if token is missing
      if (!token) {
        console.warn("⚠️ No token found. Redirecting to login/landing page.");
        navigate("/"); // Redirect to landing/login
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/attendees/my-events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("📦 Registered Events Response:", res.data);
        setEvents(res.data.events || []);
        setLoading(false);
      } catch (err) {
        console.error("❌ Fetch Error:", err);

        if (err.response) {
          console.error("🔍 Error Response:", err.response.data);

          // 🔐 Redirect on unauthorized
          if (err.response.status === 401 || err.response.status === 403) {
            navigate("/");
            return;
          }

          setError(err.response.data.message || "Failed to load registered events.");
        } else if (err.request) {
          console.error("📡 No response received:", err.request);
          setError("No response from server.");
        } else {
          console.error("⚙️ Error setting up request:", err.message);
          setError("Error setting up request.");
        }

        setLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, [navigate]);

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
                      {registration.checkInTime
                        ? formatDateTime(registration.checkInTime)
                        : "Not checked in"}
                    </td>
                    <td>
                      {registration.checkOutTime
                        ? formatDateTime(registration.checkOutTime)
                        : "Not checked out"}
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
