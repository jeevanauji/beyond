import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Products from "./Compnents/Products";
import Login from "./Compnents/Login";
import OrderTracking from "./Pages/OrderTracking.jsx";
import {
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Admin from "./Compnents/Admin.jsx";
import DeliveryBoy from "./Compnents/DeliveryBoy.jsx";
import Dashboard from "./Pages/Dashboard.jsx";

function App() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("http://localhost:3000/");
        setData(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Logout function (must be outside useEffect)
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false); // re-render UI
  };

  // If not logged in, show login page
  if (!isLoggedIn) {
    return (
      <>
        <nav className="navbar navbar-light bg-light">
          <form className="form-inline">
            <button className="btn btn-outline-secondary" type="button">
              Home
            </button>
            <button
              className="btn btn-sm btn-outline-success"
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </form>
        </nav>
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      </>
    );
  }

  // If logged in, show products and logout button
  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <form className="form-inline">
          <button className="btn btn-outline-success" type="button"
          onClick={() => navigate("/")}
          >
            Home
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            type="button"
            onClick={() => navigate("/track-order")}
          >
            Track Your Order
          </button>
        </form>
      </nav>
      <Routes>
        <Route path="/" element={<Products data={data} />} />
        <Route path="/track-order" element={<OrderTracking />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/delivery-boy" element={<DeliveryBoy />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
