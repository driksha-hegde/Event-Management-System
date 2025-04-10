import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageRoles.css";


const ManageRoles = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userList = Array.isArray(res.data) ? res.data : res.data.users || [];
      setUsers(userList);
    } catch (error) {
      console.error("Failed to fetch users:", error.response?.data || error.message);
      setMessage("❌ Could not fetch users");
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId, newRole) => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/update-role", 
        { userId, newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message || "✅ Role updated successfully");
      fetchUsers(); 
    } catch (error) {
      console.error("Failed to update role:", error.response?.data || error.message);
      setMessage("❌ Failed to update role: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="fullscreen-background">
    <div className="overlay"></div>
    <div className="all-registrations-card">
      <h2 className="table-title">🛠️ Manage User Roles</h2>
      {message && <p className="mb-4 text-sm text-blue-600">{message}</p>}
      {loading ? (
        <p className="text-center">Loading users...</p>
      ) : (
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Current Role</th>
                <th>Update Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td className="capitalize">{user.role}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user._id, e.target.value)}
                      className="border px-2 py-1 rounded bg-white"
                    >
                      <option value="attendee">Attendee</option>
                      <option value="event_manager">Event Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
  
  );
};

export default ManageRoles;
