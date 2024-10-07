import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ userType, allowedRoles }) => {
  const user = useSelector((state) => state.user.user);
  console.log(user);
  console.log(user.role);
  if (!user) {
    switch (userType) {
      case "user":
        return <Navigate to="/" replace />;
      case "airline":
        return <Navigate to="/airline/login" replace />;
      case "admin":
        return <Navigate to="/admin/login" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // Check if the user has the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user doesn't have the required role, redirect to an unauthorized page or home
    return <Navigate to="/" replace />;
  }

  // If user is logged in and has the required role, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
