import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./layouts/layout";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import Home from "./pages/homepage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes for authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Layout acts as a wrapper for main pages */}
        <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect '/' to Login */}
        <Route path="/home" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
