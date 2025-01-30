import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css"; // Sidebar styling

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

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
              <li>
                <Link to="/expenses">💰 Expenses</Link>
              </li>
              <li>
                <Link to="/import-export">📂 Import/Export</Link>
              </li>
            </ul>
          </>
        )}
      </div>

      {/* Content */}
      
    </div>
  );
};

export default Sidebar;