import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import NavbarPublic from "./components/NavbarPublic";
import NavbarPrivate from "./components/NavbarPrivate";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import LandingPage from "./pages/LandingPage";
import RegistrationForm from "./components/RegistrationForm"; // Import RegistrationForm
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Stripe imports
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./components/PaymentForm"; // Assuming PaymentForm is inside the components folder

// Load Stripe with your Public Key (Replace with your actual key)
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
      {isLoggedIn ? <NavbarPrivate onLogout={() => setIsLoggedIn(false)} /> : <NavbarPublic />}

      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          {/* Stripe Payment Route */}
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

          <Route path="/dashboard" element={isLoggedIn ? <Dashboard userRole={userRole} /> : <Navigate to="/" />} />
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/" />} />

          {/* Attendee Registration Route (Only accessible when logged in) */}
          <Route path="/event/register" element={isLoggedIn ? <RegistrationForm /> : <Navigate to="/login" />} />


          <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
