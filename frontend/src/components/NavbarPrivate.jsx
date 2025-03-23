import { Link, useNavigate } from "react-router-dom";

const NavbarPrivate = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");  // Remove token from storage
    localStorage.removeItem("user");   // Remove user data
    navigate("/"); // Redirect to login
    window.location.reload(); // Refresh to update UI
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/dashboard">Event Management</Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">Profile</Link>
            </li>
            <li className="nav-item">
            <button className="btn btn-danger btn-xs ms-2" style={{ fontSize: "15px" }} onClick={handleLogout}>Logout</button>

            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarPrivate;
