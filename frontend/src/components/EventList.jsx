import { useState } from "react";
import axios from "../api/api";
import "../styles/EventList.css";

const EventList = ({ events, userRole }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const openModal = (event) => setSelectedEvent(event);
  const closeModal = () => setSelectedEvent(null);

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
            <button className="btn btn-success">Register</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;
