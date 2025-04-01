import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./RegistrationForm.css"; // ✅ Importing the updated CSS file

const RegistrationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [eventId, setEventId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const eventIdFromURL = params.get("eventId");

    if (eventIdFromURL) {
      setEventId(eventIdFromURL);
    } else {
      navigate("/dashboard");
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to register for an event.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/registrations/register",
        { ...formData, eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("🎉 Registration Successful!");
      navigate("/dashboard");
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || "Something went wrong."));
    }
  };

  return (
    <div className="fullscreen-background">
      <div className="overlay"></div>
      <div className="registration-card">
        <h2>Register for Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="register-button">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
