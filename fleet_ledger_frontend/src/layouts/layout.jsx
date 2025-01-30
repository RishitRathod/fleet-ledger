import React from "react";
import Sidebar from "../components/sidebar.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-grow p-4">
        <Outlet /> {/* ✅ This renders the current route (e.g., Home) */}
      </div>
    </div>
  );
};

export default Layout;
