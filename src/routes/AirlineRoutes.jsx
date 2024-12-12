import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import LoadingFallback from "../components/LoadingFallback";

import SeatConfigPage from "../pages/Airline/SeatConfig";
const LogIn = React.lazy(() => import("../pages/Airline/LogIn"));
const RegistrationForm = React.lazy(() =>
  import("../pages/Airline/RegistrationForm")
);
const Dashboard = React.lazy(() => import("../pages/Airline/Dashboard"));
const Profile = React.lazy(() => import("../pages/Airline/Profile"));
const Aircraft = React.lazy(() => import("../pages/Airline/Aircraft"));
const AddAircraft = React.lazy(() => import("../pages/Airline/AddAircraft"));
const Trips = React.lazy(() => import("../pages/Airline/Trips"));
const AddTrip = React.lazy(() => import("../pages/Airline/AddTrips"));
const UpdateAircraft = React.lazy(() =>
  import("../pages/Airline/UpdateAircraft")
);
const Bookings = React.lazy(() => import("../pages/Airline/Bookings"));
const Messages = React.lazy(() => import("../pages/Airline/Messages"));

const UserRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="register" element={<RegistrationForm />} />
        <Route element={<ProtectedRoute airlineOnly />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="aircrafts" element={<Aircraft />} />
          <Route path="aircrafts/addaircraft" element={<AddAircraft />} />
          <Route
            path="aircrafts/updateaircraft/:id"
            element={<UpdateAircraft />}
          />
          <Route
            path="aircraft/:id/seats/:classType"
            element={<SeatConfigPage />}
          />
          <Route path="trips" element={<Trips />} />
          <Route path="trips/addtrip" element={<AddTrip />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="messages" element={<Messages />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default UserRoutes;
