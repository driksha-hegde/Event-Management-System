import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "bootstrap";
import EventForm from "./EventForm";
import "./Navbar.css";

const NavbarPrivate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const createEventModalRef = useRef(null);
  const navigate = useNavigate();

  // Get user role from localStorage safely
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role || "";

  const openCreateEventModal = () => {
    setIsOpen(false); // Close sidebar
    const modalInstance = Modal.getOrCreateInstance(createEventModalRef.current);
    modalInstance.show();
  };

  const closeCreateEventModal = () => {
    const modalInstance = Modal.getInstance(createEventModalRef.current);
    if (modalInstance) modalInstance.hide();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setIsOpen(false);
    navigate("/");
  };

  return (
    <>
      <button className="menu-btn" onClick={() => setIsOpen(!isOpen)} type="button">☰</button>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setIsOpen(false)} type="button">×</button>

        <Link to="/profile" className="sidebar-item" onClick={() => setIsOpen(false)}>
          Profile
        </Link>

        {(userRole === "event_manager" || userRole === "admin") && (
          <button className="sidebar-item" onClick={openCreateEventModal} type="button">
            Create Event
          </button>
        )}

        {userRole === "event_manager" && (
          <>
            <Link to="/my-events" className="sidebar-item" onClick={() => setIsOpen(false)}>
              My Events
            </Link>
            
          </>
        )}

        {userRole === "attendee" && (
          <Link to="/registered-events" className="sidebar-item" onClick={() => setIsOpen(false)}>
            Registered Events
          </Link>
        )}

        

        {userRole === "admin" && (
          <>
          <Link to="/admin/users" className="sidebar-item" onClick={() => setIsOpen(false)}>
            All Users
          </Link>
      
          <Link to="/admin/registrations" className="sidebar-item" onClick={() => setIsOpen(false)}>
            All Registrations
          </Link>
      
          <Link to="/admin/manage-roles" className="sidebar-item" onClick={() => setIsOpen(false)}>
            Manage Roles
          </Link>
      
          <Link to="/admin/reports" className="sidebar-item" onClick={() => setIsOpen(false)}>
            Reports and  Event Performance
          </Link>
          {userRole === "admin" && (
  <Link to="/admin/feedback" className="sidebar-item" onClick={() => setIsOpen(false)}>
    Feedback
  </Link>
)}

        </>
        )}

        <button
          className="sidebar-item"
          onClick={() => {
            setIsOpen(false);
            navigate("/dashboard");
          }}
          type="button"
        >
          Dashboard
        </button>

        <button className="sidebar-item logout" onClick={handleLogout} type="button">
          Logout
        </button>
      </div>

      {/* Modal for Creating Event */}
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
                onClick={closeCreateEventModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <EventForm
                closeModal={closeCreateEventModal}
                onEventCreated={() => {
                  closeCreateEventModal();
                  setIsOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarPrivate;
