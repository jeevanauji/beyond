import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";


const AdminNavbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("admintoken"));
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
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
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        Home
                    </button>

                    <button
                        className="btn btn-outline-secondary me-2"
                        type="button"
                        onClick={() => navigate("/admin/orders")}
                    >
                        Orders
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
        </>
    )
}

export default AdminNavbar
