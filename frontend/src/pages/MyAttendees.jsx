import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./MyEvents.css"; // Reuse styles if needed

const MyAttendees = () => {
  const { eventId } = useParams();
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`http://localhost:5000/api/registrations/attendees/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAttendees(res.data.attendees);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching attendees:", err);
        setError("Failed to fetch attendees");
        setLoading(false);
      }
    };

    fetchAttendees();
  }, [eventId]);

  return (
    <div>
      <div className="my-events-background"></div>
      <div className="my-events-overlay"></div>

      <div className="my-events-card">
        <h2 className="table-title">Attendees for Event ID: {eventId}</h2>

        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {loading ? (
          <p className="text-center">Loading attendees...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : attendees.length === 0 ? (
          <p className="text-center">No attendees registered yet.</p>
        ) : (
          <ul className="attendee-list">
            {attendees.map((a, index) => (
              <li key={index}>
                👤 {a.name} ({a.email})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyAttendees;
