/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import axiosInstance from "../config/axiosInstance";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ bookingDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  // const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setErrorMessage("Stripe has not loaded yet.");
      setLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Optional: Specify anything specific here if needed
      },
      redirect: "if_required", // Avoid redirecting; handle it manually
    });
    console.log(bookingDetails);
    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        await axiosInstance.post("/create-booking", {
          ...bookingDetails,
          totalAmount: paymentIntent.amount / 100,
        });
        navigate("/payment-success", {
          state: {
            paymentId: paymentIntent.id,
          },
        });
      } catch (err) {
        setErrorMessage("Failed to save booking. Please contact support.");
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage("Payment could not be processed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Checkout
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <PaymentElement />
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
          </div>
        )}
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>

      {/* {paymentSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 font-medium text-center">
            Payment Successful! 🎉
          </p>
        </div>
      )} */}
    </div>
  );
};

export default CheckoutForm;
