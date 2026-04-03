import React from "react";
import "../styles/Header.scss";

function Header({ toggleSidebar, darkMode, toggleDarkMode }) {
    return (
        <div className="header">

            {/* App title */}
            <span className="header__title">
                🛡️BMUHIRE Insurance Management System
            </span>

            {/* Buttons on the right */}
            <div className="header__buttons">

                {/* Toggle sidebar button */}
                <button className="header__btn" onClick={toggleSidebar}>
                    ☰ Menu
                </button>

                {/* Toggle dark/light mode */}
                <button className="header__btn" onClick={toggleDarkMode}>
                    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </button>

            </div>
        </div>
    );
}

export default Header;