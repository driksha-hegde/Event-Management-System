import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import NavbarPublic from "./components/NavbarPublic";
import NavbarPrivate from "./components/NavbarPrivate";
import Dashboard from "./pages/Dashboard";  // ✅ One common dashboard
import Profile from "./pages/Profile";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import LandingPage from "./pages/LandingPage";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      setIsLoggedIn(true);
      setUserRole(user.role);
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, [isLoggedIn]); // ✅ Dependency added to re-run when `isLoggedIn` changes

  return (
    <Router>
      {isLoggedIn ? <NavbarPrivate /> : <NavbarPublic />}
      <div className="container mt-5">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ Single Dashboard for all users */}
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard userRole={userRole} /> : <Navigate to="/" />} />

          {/* Profile Page */}
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/" />} />

          {/* Redirect to Dashboard if logged in */}
          <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
