import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);

      const { token, user } = response.data;

      localStorage.setItem("token", token); // ✅ Store token
      localStorage.setItem("user", JSON.stringify(user)); // ✅ Store user data

      setIsLoggedIn(true); // ✅ Update state

      // ✅ Navigate based on role
      if (user.role === "admin") {
        navigate("/AdminDashboard");
      } else if (user.role === "event_manager") {
        navigate("/EventManagerDashboard");
      } else {
        navigate("/AttendeeDashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-75 bg-light">
      <div className="card shadow-lg p-4 border-0 rounded-4 text-center w-50">
        <h3 className="fw-bold text-primary">Welcome Back!</h3>
        <p className="text-muted small">Sign in to continue</p>

        {error && <p className="small text-danger text-center">{error}</p>}

        <form onSubmit={handleLogin}>
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
          <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold">
            Login
          </button>
        </form>

        <p className="text-center mt-3 text-muted">
          Don't have an account? <Link to="/register" className="text-decoration-none fw-bold">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
