import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AllUsers.css"; 

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, []);



  return (
    <>
      <div className="all-users-background"></div>
      <div className="all-users-overlay"></div>
      <div className="all-users-card">
        <h2 className="table-title">All Users</h2>
        {users.length > 0 ? (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">No users found.</p>
        )}
      </div>
    </>
  );
};

export default AllUsers;
