import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data?.message);
        navigate("/");
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4 border-0 rounded-4 text-center w-50 mx-auto">
        <h2 className="fw-bold text-primary mb-3">Dashboard</h2>
        {user ? (
          <div>
            <h4 className="text-dark">Welcome, {user.username}!</h4>
            <p className="text-muted"><strong>Email:</strong> {user.email}</p>
            <p className="text-muted"><strong>Role:</strong> {user.role}</p>
            <button 
              className="btn btn-outline-primary mt-3 px-4 rounded-pill fw-bold"
              onClick={() => navigate("/profile")}
            >
              View Profile
            </button>
          </div>
        ) : (
          <p className="text-danger">Loading dashboard...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

