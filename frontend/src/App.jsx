import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import NavbarPublic from "./components/NavbarPublic";
import NavbarPrivate from "./components/NavbarPrivate";
import Dashboard from "./pages/Dashboard";
import AttendeeDashboard from "./pages/AttendeeDashboard";
import EventManagerDashboard from "./pages/EventManagerDashboard";
import Profile from "./pages/Profile";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      setIsLoggedIn(true);
      setUserRole(user.role);
    }
  }, []);

  return (
    <Router>
      {/* Show Navbar based on login status */}
      {isLoggedIn ? <NavbarPrivate setIsLoggedIn={setIsLoggedIn} /> : <NavbarPublic />}

      <div className="container mt-5">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={isLoggedIn ? <Profile /> : <Navigate to="/" />}
          />

          {/* Role-Based Routes */}
          <Route
            path="/attendee-dashboard"
            element={
              isLoggedIn && userRole === "attendee" ? (
                <AttendeeDashboard />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/event-manager-dashboard"
            element={
              isLoggedIn && userRole === "event_manager" ? (
                <EventManagerDashboard />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;