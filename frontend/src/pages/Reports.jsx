import React, { useState, useEffect } from 'react';
import { getRegistrationReport, getEventPerformance } from '../services/reportService';
import './Reports.css';

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
      console.log("✅ Registration report:", regReport);

      const eventPerf = await getEventPerformance(token);
      console.log("✅ Event performance:", eventPerf);

      setRegistrationReport(regReport);
      setEventPerformance(eventPerf);
    } catch (err) {
      console.error("❌ Error fetching reports:", err);
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
    <>
      <div className="reports-background" />
      <div className="reports-overlay" />
      <div className="reports-container">
        <div className="report-section">
          <h2>Registration Report</h2>
          <table>
            <thead>
              <tr>
                <th>Total Registrations</th>
                <th>Payment Status</th>
                
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{registrationReport.totalRegistrations}</td>
                <td>
                  Pending: {registrationReport.paymentStatusCounts.pending}, Completed: {registrationReport.paymentStatusCounts.completed}, Failed: {registrationReport.paymentStatusCounts.failed}
                </td>
                
              </tr>
            </tbody>
          </table>
        </div>

        <div className="report-section">
          <h2>Event Performance</h2>
          <table>
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Total Registrations</th>
                <th>Check-ins</th>
                <th>Check-outs</th>
                <th>Attendance Rate</th>
              </tr>
            </thead>
            <tbody>
              {eventPerformance.map((event) => (
                <tr key={event.title}>
                  <td>{event.title}</td>
                  <td>{event.totalRegistrations}</td>
                  <td>{event.checkIns}</td>
                  <td>{event.checkOuts}</td>
                  <td>{event.attendanceRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Reports;
