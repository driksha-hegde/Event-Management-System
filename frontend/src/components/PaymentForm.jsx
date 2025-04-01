import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const registrationId = searchParams.get("registrationId");
  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const phone = searchParams.get("phone");
  const registrationFee = searchParams.get("fee");

  const [clientSecret, setClientSecret] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    if (registrationId && registrationFee) {
      initiatePayment();
    }
  }, [registrationId, registrationFee]);

  // Function to get clientSecret from backend
  const initiatePayment = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: registrationFee,
          registration_id: registrationId, // ✅ Correct key
          user: { name, email, phone }
        })
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        setPaymentStatus("Failed to initiate payment");
      }
    } catch (error) {
      setPaymentStatus("Error initiating payment");
    }
  };

  // Function to confirm the payment
  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) return;

    const cardElement = elements.getElement(CardElement);

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement }
    });

    if (error) {
      setPaymentStatus(`❌ Payment failed: ${error.message}`);
    } else if (paymentIntent.status === "succeeded") {
      setPaymentStatus("✅ Payment successful! Redirecting...");
      
      // Redirect to the dashboard after successful payment
      setTimeout(() => navigate("/dashboard"), 2000);
    }
  };

  return (
    <div className="payment-container">
      <h2>Complete Your Payment</h2>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Phone:</strong> {phone}</p>
      <p><strong>Registration Fee:</strong> ₹{registrationFee}</p>

      <CardElement />
      <button onClick={handlePayment} disabled={!clientSecret}>
        Pay ₹{registrationFee}
      </button>
      <p>{paymentStatus}</p>
    </div>
  );
};

export default PaymentForm;
