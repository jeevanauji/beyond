import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admin = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const toggleMode = () => {
    setIsRegister((prev) => !prev);
    setMessage("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isRegister) {
        // Admin Register
        const res = await axios.post("http://localhost:3000/api/admin/register", formData);
        setMessage(res.data.message);
      } else {
        // Admin Login
        const res = await axios.post("http://localhost:3000/api/admin/login", {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("adminToken", res.data.token);
        setMessage(res.data.message || "✅ Login successful!");
        navigate("/admin/dashboard");

        if (onLoginSuccess) onLoginSuccess();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Something went wrong.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>{isRegister ? "Admin Register" : "Admin Login"}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        )}
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
      <button className="btn btn-link mt-3" onClick={toggleMode}>
        {isRegister
          ? "Already have an account? Login"
          : "Don't have an account? Register"}
      </button>
      {message && <p className="mt-3 text-info">{message}</p>}
    </div>
  );
};

export default Admin;
