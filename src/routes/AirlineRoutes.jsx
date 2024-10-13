import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
// import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
const LogIn = React.lazy(() => import("../pages/Airline/LogIn"));
const RegistrationForm = React.lazy(() =>
  import("../pages/Airline/RegistrationForm")
);

const UserRoutes = () => {
  return (
    <Suspense fallback={<div>Loading Airline Pages...</div>}>
      <Routes>
        <Route path="" element={<LogIn />} />
        <Route path="register" element={<RegistrationForm />} />
      </Routes>
    </Suspense>
  );
};

export default UserRoutes;
