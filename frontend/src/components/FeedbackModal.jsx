import React, { useState } from "react";
import axios from "axios";
import "./FeedbackModal.css"; // We'll style it below

const FeedbackModal = ({ onClose, selectedEvent }) => {
    const [feedback, setFeedback] = useState("");
    const [rating, setRating] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
  
    if (!selectedEvent) return null; // Only render if event is selected
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      setError("Please provide a rating.");
      return;
    }

    if (!selectedEvent || !selectedEvent._id) {
      setError("Event information is missing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/feedback",
        {
          eventId: selectedEvent._id,
          rating,
          comment: feedback,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Feedback submitted successfully!");
      onClose(); // close modal
    } catch (err) {
      console.error("Error submitting feedback", err);
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
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
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very Good</option>
            <option value="5">5 - Excellent</option>
          </select>
        </div>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
};

export default FeedbackModal;
