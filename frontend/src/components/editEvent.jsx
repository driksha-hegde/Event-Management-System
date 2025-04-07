// components/EditEvent.js
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/api";

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    registrationFee: 0
  });

  useEffect(() => {
    const fetchEvent = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEventData(res.data);
    };
    fetchEvent();
  }, [eventId]);

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
      alert("Event updated successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating event", error);
      alert("Error updating event");
    }
  };

  return (
    <div className="edit-event-form">
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" value={eventData.title} onChange={handleChange} placeholder="Title" required />
        <input name="date" value={eventData.date} onChange={handleChange} type="date" required />
        <input name="time" value={eventData.time} onChange={handleChange} type="time" required />
        <input name="location" value={eventData.location} onChange={handleChange} placeholder="Location" required />
        <input name="registrationFee" value={eventData.registrationFee} onChange={handleChange} type="number" />
        <textarea name="description" value={eventData.description} onChange={handleChange} placeholder="Description" />
        <button className="btn btn-primary" type="submit">Update Event</button>
      </form>
    </div>
  );
};

export default EditEvent;
