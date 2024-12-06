import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import LoadingFallback from "../components/LoadingFallback";

const AdminLogin = React.lazy(() => import("../pages/Admin/SigninPage"));
const AdminDashboard = React.lazy(() => import("../pages/Admin/Dashboard"));
const AdminGetUsers = React.lazy(() => import("../pages/Admin/Users"));
const Airports = React.lazy(() => import("../pages/Admin/Airports"));
const AddAirport = React.lazy(() => import("../pages/Admin/AddAirport"));
const AirlineLoginDetails = React.lazy(() =>
  import("../pages/Admin/AirlineLoginDetails")
);
const UpdateAirport = React.lazy(() => import("../pages/Admin/UpdateAirport"));
const Aircrafts = React.lazy(() => import("../pages/Admin/Aircrafts"));
const Bookings = React.lazy(() => import("../pages/Admin/Bookings"));
const FlightSchedules = React.lazy(() =>
  import("../pages/Admin/FlightSchedules")
);
const FlightTracking = React.lazy(() =>
  import("../pages/Admin/FlightTracking")
);

const AdminRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="" element={<AdminLogin />} />
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminGetUsers />} />
          <Route path="airports" element={<Airports />} />
          <Route path="airports/addairport" element={<AddAirport />} />
          <Route
            path="airports/updateairport/:id"
            element={<UpdateAirport />}
          />
          <Route path="airline-login" element={<AirlineLoginDetails />} />
          <Route path="aircrafts" element={<Aircrafts />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="flight-schedules" element={<FlightSchedules />} />
          <Route path="flight-tracking" element={<FlightTracking />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
