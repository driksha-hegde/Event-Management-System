// src/pages/AllRegistrations.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AllRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/registrations/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRegistrations(res.data.registrations || []);
      } catch (err) {
        console.error("Failed to fetch registrations", err);
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <div>
      <h2>All Registrations</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Attendee Email</th>
            <th>Event Title</th>
            <th>Event Date</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((reg) => (
            <tr key={reg._id}>
              <td>{reg.attendee?.email}</td>
              <td>{reg.event?.title}</td>
              <td>{new Date(reg.event?.date).toLocaleString()}</td>
              <td>{reg.event?.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllRegistrations;
