import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "bootstrap";
import EventForm from "./EventForm";
import "./Navbar.css"; 

const NavbarPrivate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const createEventModalRef = useRef(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;

  // Open modal when "Create Event" is clicked
  const openCreateEventModal = () => {
    setIsOpen(false); // Close sidebar
    const modalInstance = Modal.getOrCreateInstance(createEventModalRef.current);
    modalInstance.show();
  };

  // Close modal when event is created
  const closeCreateEventModal = () => {
    const modalInstance = Modal.getInstance(createEventModalRef.current);
    modalInstance.hide();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsOpen(false);
    navigate("/");
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>☰</button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>

        <Link to="/profile" className="sidebar-item" onClick={() => setIsOpen(false)}>
          Profile
        </Link>

        {(userRole === "event_manager" || userRole === "admin") && (
          <button className="sidebar-item" onClick={openCreateEventModal}>
            Create Event
          </button>
        )}

        <button className="sidebar-item" onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>

        <button className="sidebar-item logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Create Event Modal (Initially Hidden) */}
      <div
        className="modal fade"
        id="createEventModal"
        ref={createEventModalRef}
        tabIndex="-1"
        aria-labelledby="createEventModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-3">
            <div className="modal-header">
              <h5 className="modal-title fw-bold text-primary">Create Event</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {/* Render EventForm inside the modal (not always on the dashboard) */}
              <EventForm closeModal={closeCreateEventModal} onEventCreated={() => {}} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarPrivate;
