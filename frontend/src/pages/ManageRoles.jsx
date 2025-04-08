import React, { useEffect, useState } from "react";
import axios from "axios";

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

      // Support both { users: [...] } and direct array response
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
        "http://localhost:5000/api/users/update-role", // ✅ Correct API route
        { userId, newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message || "✅ Role updated successfully");
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Failed to update role:", error.response?.data || error.message);
      setMessage("❌ Failed to update role: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🛠️ Manage User Roles</h2>
      {message && <p className="mb-4 text-sm text-blue-600">{message}</p>}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="min-w-full border rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Username</th>
              <th className="p-2">Email</th>
              <th className="p-2">Current Role</th>
              <th className="p-2">Update Role</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-2">{user.username}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2 capitalize">{user.role}</td>
                <td className="p-2">
                  <select
                    value={user.role}
                    onChange={(e) => updateRole(user._id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="attendee">Attendee</option>
                    <option value="event_manager">Event Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageRoles;
