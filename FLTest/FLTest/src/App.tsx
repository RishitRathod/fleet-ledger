import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./components/ui/dashboard";
import LoginPage from "./login/page";
import Signup from "./signup";

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    // Hide sidebar on login and signup pages
    const noSidebarPaths = ['/', '/loginform', '/signup'];
    setShowSidebar(!noSidebarPaths.includes(location.pathname));
  }, [location]);

  if (!showSidebar) {
    return <main className="w-full h-screen">{children}</main>;
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-4">Fleet Ledger</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <a href="/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/transactions" className="block py-2 px-4 hover:bg-gray-700 rounded">
                Transactions
              </a>
            </li>
            <li>
              <a href="/vehicles" className="block py-2 px-4 hover:bg-gray-700 rounded">
                Vehicles
              </a>
            </li>
            <li>
              <a href="/settings" className="block py-2 px-4 hover:bg-gray-700 rounded">
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex-1">
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/loginform" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Layout>
    </Router>
  );
}
