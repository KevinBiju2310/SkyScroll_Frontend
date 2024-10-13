import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ adminOnly, airlineOnly, userOnly }) => {
  const user = useSelector((state) => state.user.user);
  console.log(user.role);
  
  if (!user) {
    // If the user is not logged in, redirect to login page
    return <Navigate to="/" />;
  }

  if (adminOnly && user.role !== "admin") {
    // Redirect if not an admin
    return <Navigate to="/unauthorized" />;
  }

  if (airlineOnly && user.role !== "airline") {
    // Redirect if not an airline user
    return <Navigate to="/unauthorized" />;
  }

  if (userOnly && user.role !== "user") {
    // Redirect if not a regular user
    return <Navigate to="/unauthorized" />;
  }

  // If all checks pass, render the children (protected component)
  return <Outlet />;
};

export default ProtectedRoute;
