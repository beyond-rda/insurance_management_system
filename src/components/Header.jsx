import React from "react";
import "../styles/Header.scss";

function Header({ toggleSidebar, darkMode, toggleDarkMode, onLogout }) {
    return (
        <div className="header">

            {/* App title */}
            <span className="header__title">
                🛡️BMUHIRE Insurance Management System
            </span>

            {/* Buttons on the right */}
            <div className="header__buttons">

                {/* Toggle sidebar */}
                <button className="header__btn" onClick={toggleSidebar}>
                    ☰ Menu
                </button>

                {/* Toggle dark/light mode */}
                <button className="header__btn" onClick={toggleDarkMode}>
                    {darkMode ? "☀️ Light" : "🌙 Dark"}
                </button>

                {/* Logout button */}
                <button className="header__btn header__btn--logout" onClick={onLogout}>
                    🚪 Logout
                </button>

            </div>
        </div>
    );
}

export default Header;