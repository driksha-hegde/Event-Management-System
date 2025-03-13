import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "participant",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("Registration successful!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-box">
      <div className="register-container">
        <h4 className="text-center">Register</h4>
        {error && <div className="alert alert-danger p-1">{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="mb-1">
            <label className="form-label small-text">Username</label>
            <input
              type="text"
              name="username"
              className="form-control small-input"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-1">
            <label className="form-label small-text">Email</label>
            <input
              type="email"
              name="email"
              className="form-control small-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-1">
            <label className="form-label small-text">Password</label>
            <input
              type="password"
              name="password"
              className="form-control small-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-1">
            <label className="form-label small-text">Role</label>
            <select 
              name="role" 
              className="form-control small-input text-center" 
              value={formData.role} 
              onChange={handleChange}
            >
              <option value="admin">Admin</option>
              <option value="participant">Participant</option>
              <option value="event manager">Event Manager</option>
            </select>
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary w-50">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;


