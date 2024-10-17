import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

const Home = React.lazy(() => import("../pages/HomePage"));
const Profile = React.lazy(() => import("../pages/ProfilePage"));
const ResetPassword = React.lazy(() => import("../pages/ResetPassword"));

const UserRoutes = () => {
  return (
    <Suspense fallback={<div>Loading User Pages...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<ProtectedRoute userOnly />}>
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="reset-password" element={<ResetPassword />} />
      </Routes>
    </Suspense>
  );
};

export default UserRoutes;
