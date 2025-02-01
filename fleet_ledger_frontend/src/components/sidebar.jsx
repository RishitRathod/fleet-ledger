import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./sidebar.css"; // Sidebar styling

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get role from localStorage
    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("role");

    console.log("User logged out");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <button
          className="sidebar-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "←" : "☰"}
        </button>
        {isOpen && (
          <>
            <h2>Dashboard</h2>
            <ul>
              <li>
                <Link to="/home">🏠 Home</Link>
              </li>
              <li>
                <Link to="/vehicles">🚗 Vehicles</Link>
              </li>
              <li>
                <Link to="/users">👥 Users</Link>
              </li>

              {/* Show Expenses only for Admins */}
              {role === "admin" && (
                <li>
                  <Link to="/expenses">💰 Expenses</Link>
                </li>
              )}

              <li>
                <Link to="/import-export">📂 Import/Export</Link>
              </li>
              <li className="logout">
                <button onClick={handleLogout} className="logout-btn">
                  🚪 Logout
                </button>
              </li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
