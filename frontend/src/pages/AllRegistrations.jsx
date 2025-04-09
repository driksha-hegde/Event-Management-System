import React, { useEffect, useState } from "react";
import axios from "axios";
import "./allRegistrations.css";

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
        console.log("Registrations from backend:", JSON.stringify(res.data, null, 2));


        setRegistrations(res.data.registrations || []);
      } catch (err) {
        console.error("Failed to fetch registrations", err);
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <div className="fullscreen-background">
      <div className="overlay"></div>
      <div className="all-registrations-card">
        <h2 className="table-title">All Registrations</h2>
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Attendee Name</th>
                <th>Attendee Email</th>
                <th>Phone</th>
                <th>Payment Status</th>
                <th>Event Title</th>
                <th>Event Date</th>
                <th>Check-In</th>
                <th>Check-Out</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg._id}>
                  <td>{reg.name || "N/A"}</td>
                  <td>{reg.user?.email || reg.email}</td>
                  <td>{reg.phone || "N/A"}</td>
                  <td>{reg.paymentStatus}</td>
                  <td>{reg.event?.title || "N/A"}</td>
                  <td>
                    {reg.event?.date
                      ? new Date(reg.event.date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {reg.checkInTime
                      ? new Date(reg.checkInTime).toLocaleTimeString()
                      : "—"}
                  </td>
                  <td>
                    {reg.checkOutTime
                      ? new Date(reg.checkOutTime).toLocaleTimeString()
                      : "—"}
                  </td>
                </tr>
              ))}
              {registrations.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">
                    No registrations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllRegistrations;