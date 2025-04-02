import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract parameters from URL
  const searchParams = new URLSearchParams(location.search);
  const registrationId = searchParams.get("registrationId");
  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const phone = searchParams.get("phone");
  const registrationFee = searchParams.get("fee");

  const [clientSecret, setClientSecret] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");

  // ✅ Function to fetch clientSecret from backend
  const initiatePayment = async () => {
    console.log("🛠 Debugging: Extracted values from URL params", {
      registrationId,
      registrationFee
    });

    if (!registrationId || !registrationFee) {
      console.error("🚨 Missing Parameters:", { registrationId, registrationFee });
      setPaymentStatus("❌ Missing required payment details.");
      return;
    }

    // ✅ Convert amount to a number to match backend expectations
    const parsedAmount = parseFloat(registrationFee);

    setPaymentStatus("Fetching payment details...");

    try {
      console.log("📤 Sending Data to Backend:", {
        registrationId,  // ✅ Match backend parameter name
        amount: parsedAmount
      });

      const response = await fetch("http://localhost:5000/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId, // ✅ Match backend expectation
          amount: parsedAmount
        })
      });

      const data = await response.json();
      console.log("📡 Response Data:", data);

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        console.log("✅ Client Secret Set:", data.clientSecret);
      } else {
        setPaymentStatus(`❌ Failed to retrieve payment details: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Payment Error:", error);
      setPaymentStatus("❌ Error initiating payment");
    }
  };

  // Fetch clientSecret when component mounts
  useEffect(() => {
    initiatePayment();
  }, []); // ✅ Runs only once when the component loads

  useEffect(() => {
    console.log("🎯 Updated Client Secret:", clientSecret);
  }, [clientSecret]);

  // ✅ Function to confirm payment with Stripe
  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) return;

    setPaymentStatus("🔄 Processing payment...");

    const cardElement = elements.getElement(CardElement);

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      setPaymentStatus(`❌ Payment failed: ${error.message}`);
    } else if (paymentIntent.status === "succeeded") {
      setPaymentStatus("✅ Payment successful! Redirecting...");
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

      {clientSecret ? (
        <>
          <CardElement />
          <button onClick={handlePayment} disabled={!stripe || !elements || !clientSecret}>
            Pay ₹{registrationFee}
          </button>
        </>
      ) : (
        <p>🔄 Loading payment details...</p>
      )}

      {paymentStatus && <p>{paymentStatus}</p>}
    </div>
  );
};

export default PaymentForm;
