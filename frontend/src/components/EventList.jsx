import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/api";
import "../styles/EventList.css";

const EventList = ({ events, setEventList, userRole }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  const openModal = (event) => setSelectedEvent(event);
  const closeModal = () => setSelectedEvent(null);

  const handleRegisterClick = (event) => {
    // ✅ Only allow register if logged in as attendee
    const token = localStorage.getItem("token");
    if (!token || userRole !== "attendee") {
      alert("Please log in as an attendee to register.");
      return;
    }

    navigate(`/event/register?eventId=${event._id}&fee=${event.registrationFee}`);
  };

  const handleEditClick = (eventId) => {
    navigate(`/event/edit/${eventId}`);
  };

  const handleDeleteClick = async (eventId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ Remove deleted event from UI
      setEventList((prevEvents) => prevEvents.filter((event) => event._id !== eventId));

      alert("Event deleted successfully.");
    } catch (error) {
      console.error("Error deleting event:", error.response?.data || error.message);
      alert("Failed to delete event.");
    }
  };

  return (
    <div className="event-container">
      {events.length === 0 ? (
        <p>No events available</p>
      ) : (
        <div className="event-list">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <h5>{event.title}</h5>

              <div className="button-group">
                <button className="btn" onClick={() => openModal(event)}>
                  View
                </button>

                {(userRole === "admin" || userRole === "event_manager") && (
                  <>
                    <button className="btn" onClick={() => handleEditClick(event._id)}>
                      Edit
                    </button>
                    <button className="btn" onClick={() => handleDeleteClick(event._id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedEvent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={closeModal}>&times;</span>
            <h2>{selectedEvent.title}</h2>
            <p><strong>Date:</strong> {selectedEvent.date}</p>
            <p><strong>Time:</strong> {selectedEvent.time}</p>
            <p><strong>Location:</strong> {selectedEvent.location}</p>
            <p><strong>Description:</strong> {selectedEvent.description}</p>

            {selectedEvent.registrationFee !== undefined && (
              <p><strong>Registration Fee:</strong> ₹{selectedEvent.registrationFee}</p>
            )}

            {/* ✅ Only attendees see the Register button */}
            {userRole === "attendee" && (
              <button
                className="btn btn-success"
                onClick={() => handleRegisterClick(selectedEvent)}
              >
                Register
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;
