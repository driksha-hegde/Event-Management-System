import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [updatedData, setUpdatedData] = useState({ username: "", email: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");

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
        setUpdatedData({ username: response.data.username, email: response.data.email });
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data?.message);
        navigate("/");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/users/profile", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(updatedData);
      setEditing(false);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data?.message);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setMessage("Please fill in all password fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/users/password", passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPasswordData({ currentPassword: "", newPassword: "" });
      setChangingPassword(false);
      setMessage("Password updated successfully! Please log in again.");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error updating password.");
    }
  };

  return (
    <div className="profile-fullscreen-background">
      <div className="profile-overlay"></div>

      <motion.div
        className="profile-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <h3 className="fw-bold">My Profile</h3>

        {message && <p className="profile-message">{message}</p>}

        {user ? (
          <div>
            {!editing && !changingPassword ? (
              <>
                <h4>{user.username}</h4>
                <p><strong>Email:</strong> {user.email}</p>

                <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
                  <button className="profile-button" onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                  </button>
                  <button className="profile-button" onClick={() => setEditing(true)}>
                    Update Profile
                  </button>
                  <button className="profile-button" onClick={() => setChangingPassword(true)}>
                    Change Password
                  </button>
                </div>
              </>
            ) : editing ? (
              <>
                <div className="mb-3 text-start">
                  <label className="form-label fw-semibold text-light">Username</label>
                  <input
                    type="text"
                    name="username"
                    className="profile-input"
                    value={updatedData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label fw-semibold text-light">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="profile-input"
                    value={updatedData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <button className="profile-button" onClick={handleUpdate}>
                    Save Changes
                  </button>
                  <button className="profile-button" onClick={() => setEditing(false)}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-3 text-start">
                  <label className="form-label fw-semibold text-light">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    className="profile-input"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label fw-semibold text-light">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="profile-input"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <button className="profile-button" onClick={handlePasswordUpdate}>
                    Change Password
                  </button>
                  <button className="profile-button" onClick={() => setChangingPassword(false)}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-danger">Loading profile...</p>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
