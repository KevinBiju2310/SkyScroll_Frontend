/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ adminOnly, airlineOnly, userOnly }) => {
  const user = useSelector((state) => state.user.user);

  if (!user) {
    return <Navigate to="/" />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/unauthorized" />;
  }

  if (airlineOnly && user.role !== "airline") {
    return <Navigate to="/unauthorized" />;
  }

  if (userOnly && user.role !== "user") {
    return <Navigate to="/unauthorized" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
