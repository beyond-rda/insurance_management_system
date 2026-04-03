import React, { useState } from "react";
import "../styles/Login.scss";

// Correct login credentials
const CORRECT_EMAIL = "muhire@123";
const CORRECT_PASSWORD = "muhire";

function Login({ onLogin }) {

    // Form values
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Error messages
    const [errors, setErrors] = useState({});

    // Handle login button click
    const handleLogin = () => {
        let newErrors = {};

        // Email validation
        if (!email.includes("@")) {
            newErrors.email = "Please enter a valid email";
        }

        // Password validation
        if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        // If there are errors show them
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Check if credentials are correct
        if (email === CORRECT_EMAIL && password === CORRECT_PASSWORD) {
            // Tell App.jsx that login was successful
            onLogin();
        } else {
            setErrors({ general: "Wrong email or password!" });
        }
    };

    return (
        <div className="login__page">
            <div className="login__box">

                {/* Logo and title */}
                <div className="login__logo">🛡️</div>
                <h1 className="login__title">Insurance Management</h1>
                <p className="login__subtitle">Sign in to your admin account</p>

                {/* Email field */}
                <div className="login__group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        placeholder="admin@insurance.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <p className="login__error">{errors.email}</p>}
                </div>

                {/* Password field */}
                <div className="login__group">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p className="login__error">{errors.password}</p>}
                </div>

                {/* General error */}
                {errors.general && <p className="login__error">{errors.general}</p>}

                {/* Login button */}
                <button className="login__btn" onClick={handleLogin}>
                    Login →
                </button>

                {/* Hint for demo */}
                <p className="login__hint">
                    use email: muhire@123 and password: muhire
                </p>

            </div>
        </div>
    );
}

export default Login;