import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
const LogIn = React.lazy(() => import("../pages/Airline/LogIn"));
const RegistrationForm = React.lazy(() =>
  import("../pages/Airline/RegistrationForm")
);
const Dashboard = React.lazy(() => import("../pages/Airline/Dashboard"));

const UserRoutes = () => {
  return (
    <Suspense fallback={<div>Loading Airline Pages...</div>}>
      <Routes>
        <Route path="" element={<LogIn />} />
        <Route path="register" element={<RegistrationForm />} />
        <Route element={<ProtectedRoute airlineOnly />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default UserRoutes;
