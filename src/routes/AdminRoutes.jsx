import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

const AdminLogin = React.lazy(() => import("../pages/Admin/SigninPage"));
const AdminDashboard = React.lazy(() => import("../pages/Admin/Dashboard"));
const AdminGetUsers = React.lazy(() => import("../pages/Admin/Users"));
const Airports = React.lazy(() => import("../pages/Admin/Airports"));
const AddAirport = React.lazy(() => import("../pages/Admin/AddAirport"));
const AirlineLoginDetails = React.lazy(() =>
  import("../pages/Admin/AirlineLoginDetails")
);
const UpdateAirport = React.lazy(() => import("../pages/Admin/UpdateAirport"));

const AdminRoutes = () => {
  return (
    <Suspense fallback={<div>Loading Admin Pages...</div>}>
      <Routes>
        <Route path="" element={<AdminLogin />} />
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminGetUsers />} />
          <Route path="airports" element={<Airports />} />
          <Route path="airports/addairport" element={<AddAirport />} />
          <Route path="airports/updateairport/:id" element={<UpdateAirport />} />
          <Route path="airline-login" element={<AirlineLoginDetails />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
