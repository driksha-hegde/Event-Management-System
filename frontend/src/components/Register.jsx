import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
    <div className="d-flex justify-content-center align-items-center min-vh-75 bg-light">
      <div className="card shadow-lg p-4 border-0 rounded-4 text-center w-50">
        <h3 className="fw-bold text-success">Create an Account</h3>
        <p className="text-muted small">Join us and start exploring</p>

        {error && <p className="small text-danger text-center">{error}</p>}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              name="username"
              className="form-control rounded-3"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              name="email"
              className="form-control rounded-3"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control rounded-3"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Role</label>
            <select
              name="role"
              className="form-control rounded-3 text-center"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="admin">Admin</option>
              <option value="participant">Attendee</option>
              <option value="event manager">Event Organizer</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-pill fw-bold">
            Register
          </button>
        </form>

        <p className="text-center mt-3 text-muted">
          Already have an account? <Link to="/" className="text-decoration-none fw-bold">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

