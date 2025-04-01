import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./RegistrationForm.css";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [eventId, setEventId] = useState(null);
  const [registrationFee, setRegistrationFee] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const eventIdFromURL = params.get("eventId");
    const eventFeeFromURL = params.get("fee");

    console.log("URL Params:", location.search); // Debugging

    if (eventIdFromURL) {
      setEventId(eventIdFromURL);
      setRegistrationFee(eventFeeFromURL ? Number(eventFeeFromURL) : 0);
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

      const registration_id = response.data.registration_id;
      
      console.log("Registration Fee:", registrationFee); // Debugging log
      console.log("Received Registration ID:", registration_id); // Debugging log

      if (registrationFee > 0) {
        // Redirect to payment if event has a fee
        navigate(`/payment?registrationId=${registration_id}&name=${formData.name}&email=${formData.email}&phone=${formData.phone}&fee=${registrationFee}`);
      } else {
        // Show success notification for free events
        alert("Registered Successfully!");
        navigate(`/success?registrationId=${registration_id}`);
      }
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
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
