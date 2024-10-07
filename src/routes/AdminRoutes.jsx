import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import AdminLogin from "../pages/Admin/SigninPage";
import AdminDashboard from "../pages/Admin/Dashboard";
import AdminGetUsers from "../pages/Admin/Users";
import Airports from "../pages/Admin/Airports";
import AddAirport from "../pages/Admin/AddAirport";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<AdminLogin />} />
      <Route
        element={<ProtectedRoute userType="admin" allowedRoles={["admin"]} />}
      >
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/users" element={<AdminGetUsers />} />
        <Route path="/airports" element={<Airports />} />
        <Route path="/airports/addairport" element={<AddAirport/>}/>
        <Route path="/airline-login" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
