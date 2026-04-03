import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout components
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

// Pages
import Dashboard from "./pages/Dashboard";
import Policies from "./pages/Policies";
import Clients from "./pages/Clients";
import Claims from "./pages/Claims";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";

import "./styles/App.scss";

function App() {

  // true = dark mode, false = light mode
  const [darkMode, setDarkMode] = useState(false);

  // true = sidebar visible, false = sidebar hidden
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    // data-theme tells our SCSS which colors to use
    <div className="app" data-theme={darkMode ? "dark" : "light"}>

      <BrowserRouter>

        {/* Top header bar */}
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
        />

        {/* Body: sidebar + main content side by side */}
        <div className="app__body">

          {/* Sidebar navigation */}
          {sidebarOpen && (
            <Sidebar
              darkMode={darkMode}
              toggleDarkMode={() => setDarkMode(!darkMode)}
            />
          )}

          {/* Main page content */}
          <div className="app__content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/policies" element={<Policies />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/claims" element={<Claims />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </div>

        </div>

      </BrowserRouter>
    </div>
  );
}

export default App;