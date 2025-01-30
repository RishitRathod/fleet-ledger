import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import "./layout.css"; // For layout-specific styling

const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Outlet /> {/* Renders the nested routes' content */}
      </main>
    </div>
  );
};

export default Layout;
