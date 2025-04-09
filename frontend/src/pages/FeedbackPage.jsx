import { useEffect, useState } from "react";

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch feedbacks from the backend API
  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage or state
      if (!token) {
        setError("No token provided");
        return;
      }
      
      const response = await fetch("http://localhost:5000/api/feedback/all", {
        headers: {
          "Authorization": `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });

      // Log response to verify it's correct JSON format
      const data = await response.json();
      console.log('Fetched Feedback Data:', data); // Log data for verification

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setFeedbacks(data); // Store the feedbacks in state
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setError("Failed to fetch feedbacks");
    } finally {
      setLoading(false);
    }
  };

  // Fetch feedbacks when component mounts
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (loading) {
    return <div>Loading feedbacks...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Feedbacks</h1>
      <div>
        {feedbacks.length === 0 ? (
          <p>No feedbacks available.</p>
        ) : (
          feedbacks.map((feedback) => (
            <div key={feedback._id} className="feedback-item">
              <h3>{feedback.event.title}</h3>
              <p><strong>Rating:</strong> {feedback.rating}</p>
              <p><strong>Comment:</strong> {feedback.comment}</p>
              <p><strong>User:</strong> {feedback.user.username}</p>
              <p><strong>Event Date:</strong> {new Date(feedback.event.date).toLocaleDateString()}</p>
              <p><strong>Feedback Date:</strong> {new Date(feedback.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
