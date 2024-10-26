import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import AddAircraft from "../pages/Airline/AddAircraft";

const LogIn = React.lazy(() => import("../pages/Airline/LogIn"));
const RegistrationForm = React.lazy(() =>
  import("../pages/Airline/RegistrationForm")
);
const Dashboard = React.lazy(() => import("../pages/Airline/Dashboard"));
const Profile = React.lazy(() => import("../pages/Airline/Profile"));
const Aircraft = React.lazy(() => import("../pages/Airline/Aircraft"));

const UserRoutes = () => {
  return (
    <Suspense fallback={<div>Loading Airline Pages...</div>}>
      <Routes>
        <Route path="" element={<LogIn />} />
        <Route path="register" element={<RegistrationForm />} />
        <Route element={<ProtectedRoute airlineOnly />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="aircrafts" element={<Aircraft />} />
          <Route path="aircrafts/addaircraft" element={<AddAircraft />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default UserRoutes;
