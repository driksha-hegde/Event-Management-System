import React, { useState } from "react";
import axios from "axios";

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(""); // State for rating
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!rating) {
      setError("Please provide a rating.");
      return;
    }
  
    if (!selectedEvent) {
      setError("Event information is missing.");
      return;
    }
  
    setLoading(true);
    setError(""); // Reset error state
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/feedback",
        { feedback, rating, event: selectedEvent._id }, // Include event ID
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Feedback submitted successfully!");
    } catch (err) {
      console.error("Error submitting feedback", err);
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="feedback-page">
      <h2>Give Feedback</h2>
      {error && <p className="error-message">{error}</p>}
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Write your feedback here..."
      />
      <div>
        <label htmlFor="rating">Rating:</label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option value="">Select Rating</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
    </div>
  );
};

export default FeedbackForm;
