import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./layouts/layout";
import Home from "./pages/homepage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout acts as a wrapper for pages */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" />} /> {/* Redirect '/' to Home */}
          <Route path="home" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
