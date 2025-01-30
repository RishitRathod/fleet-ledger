import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // Sidebar styling

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="sidebar-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
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
      </div>

      <div className={`content ${isOpen ? "shifted" : ""}`}>
        {/* Main content goes here */}
      </div>
    </>
  );
};

export default Sidebar;
