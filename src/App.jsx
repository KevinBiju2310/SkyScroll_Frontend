import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const UserRoutes = React.lazy(() => import("./routes/UserRoutes"));
const AirlineRoutes = React.lazy(() => import("./routes/AirlineRoutes"));
const AdminRoutes = React.lazy(() => import("./routes/AdminRoutes"));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/airline/*" element={<AirlineRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
