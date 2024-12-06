import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import LoadingFallback from "../components/LoadingFallback";

const Home = React.lazy(() => import("../pages/HomePage"));
const Profile = React.lazy(() => import("../pages/ProfilePage"));
const ResetPassword = React.lazy(() => import("../pages/ResetPassword"));
const TripsListing = React.lazy(() => import("../pages/TripsListing"));
const Iternery = React.lazy(() => import("../pages/Itinerary"));
const Checkout = React.lazy(() => import("../pages/CheckOut"));
const Bookings = React.lazy(() => import("../pages/BookingDetail"));
const AboutUs = React.lazy(() => import("../pages/AboutUs"));
const SuccessPage = React.lazy(() => import("../pages/PaymentSuccess"));

const UserRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<ProtectedRoute userOnly />}>
          <Route path="profile" element={<Profile />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="booking-detail/:id" element={<Bookings />} />
          <Route path="payment-success" element={<SuccessPage />} />
        </Route>
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="search-trip" element={<TripsListing />} />
        <Route path="itinerary" element={<Iternery />} />
        <Route path="about-us" element={<AboutUs />} />
      </Routes>
    </Suspense>
  );
};

export default UserRoutes;
