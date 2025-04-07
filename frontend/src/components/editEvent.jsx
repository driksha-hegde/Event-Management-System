import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/api";
import "./editEvent.css";

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    registrationFee: 0,
  });

  useEffect(() => {
    const fetchEvent = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const res = await axios.get(`/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEventData(res.data);
      } catch (error) {
        console.error("Error fetching event:", error);
        navigate("/dashboard");
      }
    };

    fetchEvent();
  }, [eventId, navigate]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(`/events/${eventId}`, eventData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Event updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Error updating event:", error);
      alert("Error updating event");
    }
  };

  return (
    <div className="fullscreen-background">
      <div className="overlay"></div>
      <div className="edit-event-card">
        <h2>Edit Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={eventData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              className="form-control"
              value={eventData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              name="time"
              className="form-control"
              value={eventData.time}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              className="form-control"
              value={eventData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Registration Fee (₹)</label>
            <input
              type="number"
              name="registrationFee"
              className="form-control"
              value={eventData.registrationFee}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              className="form-control"
              value={eventData.description}
              onChange={handleChange}
              required
            />
          </div>
          <button className="register-button" type="submit">
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
