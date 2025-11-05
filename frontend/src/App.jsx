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
  useLocation, 
} from "react-router-dom";
import Admin from "./Compnents/Admin.jsx";
import DeliveryBoy from "./Compnents/DeliveryBoy.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Navbar from "./Compnents/Navbar.jsx";
import AdminNavbar from "./Compnents/AdminNavbar.jsx";
import Orders from "./Pages/Orders.jsx";
import AddProduct from "./Pages/AddProduct.jsx";
import Order from "./Pages/Order.jsx";

function App() {
  const navigate = useNavigate();
  const location = useLocation(); 
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/"); 
  };
  const handleLogoutAdmin = () => {
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false);
    navigate("/admin"); 
  };

  if (!isLoggedIn && !location.pathname.startsWith("/admin")) {
    return (
      <>
        <Navbar onLogout={handleLogout} />
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      </>
    );
  }

  const isAdminRoute =
    location.pathname === "/admin"
    || location.pathname === "/admin/dashboard"
    || location.pathname === "/admin/orders"
    || location.pathname === "/admin/add-product";

  return (
    <>
      {isAdminRoute ? (
        <AdminNavbar onLogout={handleLogoutAdmin} />
      ) : (
        <Navbar onLogout={handleLogout} />
      )}

      <Routes>
        <Route path="/" element={<Products data={data} />} />
        <Route path="/track-order" element={<OrderTracking />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/delivery-boy" element={<DeliveryBoy />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/order" element={<Order />} />
      </Routes>
    </>
  );
}

export default App;
