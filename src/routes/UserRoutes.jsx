import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Home from "../pages/HomePage";
import Profile from "../pages/ProfilePage";
// Import other user components as needed

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        element={<ProtectedRoute userType="user" allowedRoles={["user"]} />}
      >
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
