import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./MyAttendees.css";

const MyAttendees = () => {
  const { eventId } = useParams();
  const [attendees, setAttendees] = useState([]);
  const [eventTitle, setEventTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [attendeeRes, eventRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/registrations/attendees/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5000/api/events/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setAttendees(attendeeRes.data.attendees);
        setEventTitle(eventRes.data.title || "Untitled Event");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch attendees or event info");
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  return (
    <>
      <div className="my-attendees-background"></div>
      <div className="my-attendees-overlay"></div>

      <div className="my-attendees-card">
        <h2 className="table-title">Attendees for: {eventTitle}</h2>

        {loading ? (
          <p className="text-center">Loading attendees...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : attendees.length === 0 ? (
          <p className="text-center">No attendees registered yet.</p>
        ) : (
          <div className="table-wrapper">
            <table className="attendee-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((a, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{a.name}</td>
                    <td>{a.email}</td>
                    <td>{a.phone || "N/A"}</td>
                    <td>{a.checkInTime ? new Date(a.checkInTime).toLocaleString() : "N/A"}</td>
                    <td>{a.checkOutTime ? new Date(a.checkOutTime).toLocaleString() : "N/A"}</td>
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

export default MyAttendees;
