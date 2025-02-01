import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./layouts/layout.jsx";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import Home from "./pages/homepage.jsx";
import AdminDashboard from "./admin/pages/admin_dashboard.jsx";
// import UserDashboard from "./user/pages/user_dashboard.jsx";

// Protected Route Wrapper
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("token"); // Check authentication
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes for authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Routes with Sidebar */}
        <Route element={<ProtectedRoute element={<Layout />} />}>
          <Route path="/" element={<Navigate to="/home" />} /> {/* Redirect '/' to Home */}
          <Route path="/home" element={<Home />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* <Route path="/user/dashboard" element={<UserDashboard />} /> */}
        </Route>

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
