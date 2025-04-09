// src/components/Reports.js
import React, { useState, useEffect } from 'react';
import { getRegistrationReport, getEventPerformance } from '../services/reportService';

const Reports = () => {
  const [registrationReport, setRegistrationReport] = useState(null);
  const [eventPerformance, setEventPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const regReport = await getRegistrationReport(token);
        const eventPerf = await getEventPerformance(token);
        setRegistrationReport(regReport);
        setEventPerformance(eventPerf);
      } catch (err) {
        setError('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Registration Report</h2>
      <table>
        <thead>
          <tr>
            <th>Total Registrations</th>
            <th>Payment Status</th>
            <th>User Roles</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{registrationReport.totalRegistrations}</td>
            <td>
              Pending: {registrationReport.paymentStatusCounts.pending}, Completed: {registrationReport.paymentStatusCounts.completed}, Failed: {registrationReport.paymentStatusCounts.failed}
            </td>
            <td>
              Attendees: {registrationReport.roleCounts.attendee}, Event Managers: {registrationReport.roleCounts.event_manager}, Admins: {registrationReport.roleCounts.admin}
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Event Performance</h2>
      <table>
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

export default Reports;
