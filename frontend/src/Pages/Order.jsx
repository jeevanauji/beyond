import React, { useEffect, useState } from "react";
import { data, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {}; // get passed product
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
 
    name: "",
    email: "",
    address: "",
    quantity: 1,
  });

  if (!product) {
    return <h3>No product selected.</h3>;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      id: user ? user._id : "",
      productId: product._id,
      title: product.title,
      price: product.priceStart,
      mainImage: product.mainImage,
      ...formData,
    };

    try {
      await axios.post("http://localhost:3000/api/orders/placed", orderData);

      alert("Order placed successfully!");
      navigate("/"); 
    } catch (error) {
      console.error("Order failed:", error);
      alert("There was a problem placing your order.");
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(res.data);

        setFormData((prev) => ({
          ...prev,
          name: res.data.username || "",
          email: res.data.email || "",
        }));
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Order Summary</h2>
      <div className="row">
        {/* Product Info */}
        <div className="col-md-6 text-center">
          <img
            src={product.mainImage}
            alt={product.title}
            className="img-fluid rounded mb-3"
            style={{ maxHeight: "300px" }}
          />
          <h4>{product.title}</h4>
          <p className="text-muted">Price: ${product.priceStart * formData.quantity}</p>
        </div>

        {/* Order Form */}
        <div className="col-md-6">
          <h4>Enter Your Details</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Address</label>
              <textarea
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                name="quantity"
                className="form-control"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Confirm Purchase
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Order;
