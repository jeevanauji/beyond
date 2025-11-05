import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";


const AdminNavbar = ({ onLogout }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("admintoken"));
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("admintoken");
        setIsLoggedIn(false);
        navigate("/admin");
    };
    return (
        <>
            <nav className="navbar navbar-light bg-light">
                <form className="form-inline">
                    <button
                        className="btn btn-outline-success me-2"
                        type="button"
                        onClick={() => localStorage.getItem("adminToken") ? navigate("/admin/dashboard") : navigate("/admin")}
                    >
                        Home
                    </button>

                    <button
                        className="btn btn-outline-secondary me-2"
                        type="button"
                        onClick={() => localStorage.getItem("adminToken") ? navigate("/admin/orders") : navigate("/admin")}
                    >
                        Orders
                    </button>


                    <button
                        className="btn btn-outline-danger"
                        type="button"
                        onClick={onLogout}
                    >
                        Logout
                    </button>
                </form>
            </nav>
        </>
    )
}

export default AdminNavbar
