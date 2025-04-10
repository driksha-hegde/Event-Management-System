import { useEffect, useState } from "react";
import "./FeedbackPage.css"; 

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token provided");
        return;
      }

      const response = await fetch("http://localhost:5000/api/feedback/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Fetched Feedback Data:", data);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setFeedbacks(data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setError("Failed to fetch feedbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (loading) return <div>Loading feedbacks...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
    <div className="all-users-background"></div>
<div className="all-users-overlay"></div>
<div className="all-users-card">
  <h1 className="table-title">Feedbacks</h1>
  <div className="table-wrapper">
    <table className="custom-table">
      <thead>
        <tr>
          <th>Event</th>
          <th>Rating</th>
          <th>Comment</th>
          <th>User</th>
          <th>Event Date</th>
          <th>Feedback Date</th>
        </tr>
      </thead>
      <tbody>
        {feedbacks.map((fb) => (
          <tr key={fb._id}>
            <td>{fb.event?.title || "N/A"}</td>
            <td>{fb.rating}</td>
            <td>{fb.comment}</td>
            <td>{fb.user?.username || "N/A"}</td>
            <td>{new Date(fb.event?.date).toLocaleDateString()}</td>
            <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
</>
  );
};

export default FeedbackPage;
