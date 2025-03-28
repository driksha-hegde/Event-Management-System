import axios from "../api/api";

const EventList = ({ events, userRole }) => {
  const handleUpdate = async (eventId) => {
    const updatedTitle = prompt("Enter new title:");
    if (!updatedTitle) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(`/events/${eventId}`, { title: updatedTitle }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Event updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <div>
      {events.length === 0 ? (
        <p>No events available</p>
      ) : (
        <ul className="list-group">
          {events.map((event) => (
            <li key={event._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>{event.title}</h5>
                <p>{event.date} | {event.location}</p>
                <p>{event.description}</p>
              </div>

              {userRole === "admin" && (
                <button className="btn btn-warning btn-sm" onClick={() => handleUpdate(event._id)}>Edit</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventList;
