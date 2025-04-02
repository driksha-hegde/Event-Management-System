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

    console.log("🔍 URL Params:", location.search); // Debugging

    if (!eventIdFromURL) {
      console.warn("❌ Missing eventId in URL, redirecting...");
      navigate("/dashboard");
      return;
    }

    setEventId(eventIdFromURL);
    setRegistrationFee(eventFeeFromURL ? Number(eventFeeFromURL) : 0);
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("❌ You must be logged in to register for an event.");
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      alert("❌ All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/registrations/register",
        { ...formData, eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Extract registration ID from response
      const registrationId = response.data.registration._id;

      console.log("✅ Registration Successful!"); 
      console.log("💰 Registration Fee:", registrationFee); 
      console.log("🆔 Received Registration ID:", registrationId); 

      if (registrationFee > 0) {
        // Redirect to payment page
        navigate(
          `/payment?registrationId=${encodeURIComponent(registrationId)}&name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&phone=${encodeURIComponent(formData.phone)}&fee=${registrationFee}`
        );
      } else {
        // Redirect to success page for free events
        alert("✅ Registered Successfully!");
        navigate(`/success?registrationId=${encodeURIComponent(registrationId)}`);
      }
    } catch (error) {
      console.error("❌ Error:", error.response?.data?.message || error.message);
      alert("❌ Error: " + (error.response?.data?.message || "Something went wrong."));
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
