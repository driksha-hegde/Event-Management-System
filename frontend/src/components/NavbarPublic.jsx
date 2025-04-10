import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; 

const NavbarPublic = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Burger Menu Button */}
      <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>

        <Link to="/login" className="sidebar-item" onClick={() => setIsOpen(false)}>Login</Link>
        <Link to="/register" className="sidebar-item" onClick={() => setIsOpen(false)}>Register</Link>
      </div>
    </>
  );
};

export default NavbarPublic;
