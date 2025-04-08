import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Components & Pages
import Login from "./components/Login";
import Register from "./components/Register";
import NavbarPublic from "./components/NavbarPublic";
import NavbarPrivate from "./components/NavbarPrivate";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import LandingPage from "./pages/LandingPage";
import RegistrationForm from "./components/RegistrationForm";
import EditEvent from "./components/editEvent";
import RegisteredEvents from "./pages/RegisteredEvents";
import AllUsers from "./pages/AllUsers";
import AllRegistrations from "./pages/AllRegistrations";
import ManageRoles from "./pages/ManageRoles";
import MyEvents from "./pages/MyEvents";
import MyAttendees from "./pages/MyAttendees"; // ✅ View attendees route

// Stripe
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./components/PaymentForm";

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const stripePromise = loadStripe("pk_test_51R91yCQPEb3UJG4rJvyLve1Kiq0x3dVmXVX9qEc0zCRhRAkj85fEglvtBALkj3WWErbi234zl3sAegxFsogBm8sO00rvp69R6f");

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if (token && user) {
        setIsLoggedIn(true);
        setUserRole(user.role);
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <Router>
      {isLoggedIn ? (
        <NavbarPrivate onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <NavbarPublic />
      )}

      <div className="container mt-5">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />

          {/* Stripe Payment */}
          <Route
            path="/payment"
            element={
              isLoggedIn ? (
                <Elements stripe={stripePromise}>
                  <PaymentForm />
                </Elements>
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Protected Routes for All Users */}
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard userRole={userRole} /> : <Navigate to="/" />} />
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/" />} />
          <Route
            path="/event/register"
            element={isLoggedIn ? <RegistrationForm /> : <Navigate to="/login" />}
          />

          {/* Event Edit: Admin & Event Manager */}
          <Route
            path="/event/edit/:eventId"
            element={
              isLoggedIn && (userRole === "admin" || userRole === "event_manager") ? (
                <EditEvent />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Attendee Only */}
          <Route
            path="/registered-events"
            element={
              isLoggedIn && userRole === "attendee" ? (
                <RegisteredEvents />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />

          {/* Event Manager Only */}
          <Route
            path="/my-events"
            element={
              isLoggedIn && userRole === "event_manager" ? (
                <MyEvents />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/my-attendees/:eventId"
            element={
              isLoggedIn && userRole === "event_manager" ? (
                <MyAttendees />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Admin Only */}
          <Route
            path="/admin/users"
            element={
              isLoggedIn && userRole === "admin" ? (
                <AllUsers />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin/registrations"
            element={
              isLoggedIn && userRole === "admin" ? (
                <AllRegistrations />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin/manage-roles"
            element={
              isLoggedIn && userRole === "admin" ? (
                <ManageRoles />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Admin & Event Manager: All Attendees */}
          <Route
            path="/attendees"
            element={
              isLoggedIn && (userRole === "admin" || userRole === "event_manager") ? (
                <MyAttendees />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
