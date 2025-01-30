import React from "react";
import "./homepage.css";

const Home = () => {
  return (
    <div className="homepage">
      <header className="header">
        <h1 className="title">Expense Tracker Dashboard</h1>
        <p className="subtitle">Manage your expenses effortlessly</p>
      </header>

      <div className="stats-grid">
        <div className="card">
          <h2>Total Expenses</h2>
          <p className="amount">$2,345</p>
        </div>
        <div className="card">
          <h2>Monthly Budget</h2>
          <p className="amount">$5,000</p>
        </div>
        <div className="card">
          <h2>Remaining Balance</h2>
          <p className="amount">$2,655</p>
        </div>
        <div className="card">
          <h2>Last Expense</h2>
          <p className="amount">$120 (Groceries)</p>
        </div>
      </div>

      <section className="recent-expenses">
        <h2>Recent Expenses</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-01-28</td>
              <td>Food</td>
              <td>Lunch at Subway</td>
              <td>$12</td>
            </tr>
            <tr>
              <td>2025-01-27</td>
              <td>Transport</td>
              <td>Taxi Ride</td>
              <td>$25</td>
            </tr>
            <tr>
              <td>2025-01-26</td>
              <td>Entertainment</td>
              <td>Movie Ticket</td>
              <td>$15</td>
            </tr>
          </tbody>
        </table>
      </section>

      <footer className="footer">
        <p>Start tracking your expenses today and take control of your finances!</p>
      </footer>
    </div>
  );
};

export default Home;
