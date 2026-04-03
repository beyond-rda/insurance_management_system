import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.scss";

function Sidebar({ darkMode, toggleDarkMode }) {
    return (
        <div className="sidebar">

            {/* Navigation links */}
            <ul className="sidebar__menu">

                <li>
                    <Link className="sidebar__item" to="/">
                        📊 Dashboard
                    </Link>
                </li>

                <li>
                    <Link className="sidebar__item" to="/policies">
                        📄 Policies
                    </Link>
                </li>

                <li>
                    <Link className="sidebar__item" to="/clients">
                        👥 Clients
                    </Link>
                </li>

                <li>
                    <Link className="sidebar__item" to="/claims">
                        📋 Claims
                    </Link>
                </li>

                <li>
                    <Link className="sidebar__item" to="/payments">
                        💳 Payments
                    </Link>
                </li>

                <li>
                    <Link className="sidebar__item" to="/reports">
                        📈 Reports
                    </Link>
                </li>

            </ul>

            {/* Divider line */}
            <hr className="sidebar__divider" />

            {/* Dark/Light mode toggle */}
            <button className="sidebar__toggle" onClick={toggleDarkMode}>
                {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

        </div>
    );
}

export default Sidebar;