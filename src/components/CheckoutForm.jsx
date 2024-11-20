import { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axiosInstance from "../config/axiosInstance";

const CheckoutForm = ({ clientSecret, bookingDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // console.log(bookingDetails);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      }
    );

    if (error) {
      setErrorMessage(error.message);
    } else if (paymentIntent.status === "succeeded") {
      const response = await axiosInstance.post("/create-booking", {
        ...bookingDetails,
        totalAmount: paymentIntent.amount / 100,
      });
      console.log(response);
      setPaymentSuccess(true);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        letterSpacing: "0.025em",
        fontFamily: "Arial, sans-serif",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Checkout
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Card Number Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
              <CardNumberElement options={cardStyle} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Expiry Date Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                <CardExpiryElement options={cardStyle} />
              </div>
            </div>

            {/* CVC Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                CVC
              </label>
              <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                <CardCvcElement options={cardStyle} />
              </div>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!stripe}
        >
          Pay Now
        </button>
      </form>

      {paymentSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-center text-green-600 font-medium">
            Payment Successful! 🎉
          </p>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
