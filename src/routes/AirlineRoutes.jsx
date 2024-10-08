import { Routes, Route } from "react-router-dom";
// import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import LogIn from "../pages/Airline/LogIn";
import RegistrationForm from "../pages/Airline/RegistrationForm";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<LogIn />} />
      <Route path="register" element={<RegistrationForm />} />
    </Routes>
  );
};

export default UserRoutes;
