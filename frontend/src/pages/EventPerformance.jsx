// src/pages/EventPerformance.js
import React, { useState, useEffect } from 'react';
import { getEventPerformance } from '../services/reportService';

const EventPerformance = () => {
  const [eventPerformance, setEventPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchEventPerformance = async () => {
      try {
        const performanceData = await getEventPerformance(token);
        setEventPerformance(performanceData);
      } catch (err) {
        setError('Failed to load event performance data');
      } finally {
        setLoading(false);
      }
    };

    fetchEventPerformance();
  }, [token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Event Performance</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Event Title</th>
            <th>Total Registrations</th>
            <th>Check-ins</th>
            <th>Attendance Rate</th>
          </tr>
        </thead>
        <tbody>
          {eventPerformance.map((event) => (
            <tr key={event.title}>
              <td>{event.title}</td>
              <td>{event.totalRegistrations}</td>
              <td>{event.checkIns}</td>
              <td>{event.attendanceRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventPerformance;
