import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ onLogout }) {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <nav className="navbar navbar-light bg-light">
            <form className="form-inline">
                <button
                    className="btn btn-outline-success me-2"
                    type="button"
                    onClick={() => navigate("/")}
                >
                    Home
                </button>

                <button
                    className="btn btn-outline-secondary me-2"
                    type="button"
                    onClick={() => navigate("/track-order")}
                >
                    Track Order
                </button>

                <button
                    className="btn btn-outline-secondary me-2"
                    type="button"
                    onClick={() => navigate("/admin")}
                >
                    Admin
                </button>

                <button
                    className="btn btn-outline-danger"
                    type="button"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </form>
        </nav>
    );
}

export default Navbar;
