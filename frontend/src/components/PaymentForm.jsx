import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentForm.css"; // ✅ Ensure this is imported

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
    const initiatePayment = async () => {
      if (!registrationId || !registrationFee) {
        setPaymentStatus("❌ Missing payment details.");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/payments/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ registrationId, amount: parseFloat(registrationFee) }),
        });

        const data = await response.json();
        if (data.clientSecret) setClientSecret(data.clientSecret);
        else setPaymentStatus(`❌ Failed to retrieve payment details: ${data.message}`);
      } catch (error) {
        setPaymentStatus("❌ Error initiating payment");
      }
    };

    initiatePayment();
  }, [registrationId, registrationFee]);

  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) return;

    setPaymentStatus("🔄 Processing payment...");

    const cardElement = elements.getElement(CardElement);
    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) setPaymentStatus(`❌ Payment failed: ${error.message}`);
    else if (paymentIntent.status === "succeeded") {
      setPaymentStatus("✅ Payment successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 2000);
    }
  };

  return (
    <div className="fullscreen-background">
      <div className="overlay"></div>
      <div className="payment-card">
        <h2>Complete Your Payment</h2>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Phone:</strong> {phone}</p>
        <p><strong>Registration Fee:</strong> ₹{registrationFee}</p>

        {clientSecret ? (
          <>
            <div className="card-input">
              <CardElement />
            </div>
            <button className="pay-button" onClick={handlePayment} disabled={!stripe || !elements || !clientSecret}>
              Pay ₹{registrationFee}
            </button>
          </>
        ) : (
          <p className="payment-status">🔄 Loading payment details...</p>
        )}

        {paymentStatus && <p className={`payment-status ${paymentStatus.includes("✅") ? "success" : "error"}`}>{paymentStatus}</p>}
      </div>
    </div>
  );
};

export default PaymentForm;
//needs some changes