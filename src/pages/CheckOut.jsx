import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { useEffect, useState } from "react";
import axiosInstance from "../config/axiosInstance";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";

const stripePromise = loadStripe(
  "pk_test_51QKPOPDRGApPeaXHdkWLkwl4P210wyUdl2wtyLmFYoQRpckYNKmeUxiVR07au35Epa5ggBhu7TzSmj6u3bYjccMN003J23EqiZ"
);

const CheckOut = () => {
  const user = useSelector((state) => state.user.user);
  const { state } = useLocation();
  const {
    totalPrice,
    flightDetails,
    selectedSeats,
    passengerDetails,
    contactInfo,
    travelClass,
  } = state;
  const [clientSecret, setClientSecret] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const bookingDetails = {
    flightId: flightDetails._id,
    user: user._id,
    selectedSeats,
    travelClass,
    passengers: passengerDetails.map(({ isChild, ...passenger }) => ({
      ...passenger,
      passengerType: isChild ? "CHILD" : "ADULT",
    })),
    contactInfo,
  };
  console.log(bookingDetails);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const response = await axiosInstance.post("/create-payment-intent", {
          amount: totalPrice,
        });
        setClientSecret(response.data.response);
        setPaymentProcessing(true);
      } catch (error) {
        console.error("Error creating payment", error);
      }
    };
    fetchPaymentIntent();
  }, [totalPrice]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-1 max-w-9xl px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          {paymentProcessing && clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm bookingDetails={bookingDetails} />
            </Elements>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckOut;
