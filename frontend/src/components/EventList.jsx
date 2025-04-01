import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import this
import axios from "../api/api";
import "../styles/EventList.css";

const EventList = ({ events, userRole }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate(); // Initialize navigate function

  const openModal = (event) => setSelectedEvent(event);
  const closeModal = () => setSelectedEvent(null);

  const handleRegisterClick = (eventId) => {
    navigate(`/event/register?eventId=${eventId}`); // Navigate to the registration form with eventId
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
              <button className="btn btn-primary" onClick={() => openModal(event)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal Popup */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={closeModal}>&times;</span>
            <h2>{selectedEvent.title}</h2>
            <p><strong>Date:</strong> {selectedEvent.date}</p>
            <p><strong>Time:</strong> {selectedEvent.time}</p>
            <p><strong>Location:</strong> {selectedEvent.location}</p>
            <p><strong>Description:</strong> {selectedEvent.description}</p>

            {/* Display Registration Fee */}
            {selectedEvent.registrationFee !== undefined && (
              <p><strong>Registration Fee:</strong> ₹{selectedEvent.registrationFee}</p>
            )}

            {userRole === "attendee" && (
              <button className="btn btn-success" onClick={() => handleRegisterClick(selectedEvent._id)}>
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
