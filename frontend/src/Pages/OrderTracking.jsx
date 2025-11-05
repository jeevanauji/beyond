import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ot.css";

const OrderTracking = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Order ID from URL
  const [orders, setOrders] = useState([]); // Changed to array to support multiple orders
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // go back to home or login page
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/orders/user/${user._id}`
        );
        setOrders(res.data); // This will be an array of orders
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (loading)
    return <p className="text-center mt-5">Loading order details...</p>;
  if (!orders.length) return <p className="text-center mt-5">No orders found.</p>;

  // Step highlighting logic
  const statusSteps = ["Pending", "Processing", "Shipped", "Delivered"];

  return (
    <div>
      <section className="vh-100" style={{ backgroundColor: "#8c9eff" }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12">
              <div
                className="card card-stepper"
                style={{ borderRadius: "16px" }}
              >
                <div className="card-body p-5">
                  {/* 🔹 Orders Loop */}
                  {orders.map((order) => {
                    // Step highlighting logic for each order
                    const activeStepIndex = statusSteps.indexOf(order.status);

                    return (
                      <div key={order._id}>
                        {/* 🔹 Order Info Header */}
                        <div className="d-flex justify-content-between align-items-center mb-5">
                          <div>
                            <h5 className="mb-0">
                              INVOICE{" "}
                              <span className="text-primary font-weight-bold">
                                #{order._id.slice(0, 8)}
                              </span>
                            </h5>
                            <p className="text-muted mb-0">
                              Ordered by: <strong>{order.name}</strong> <br />
                              Email: {order.email}
                            </p>
                          </div>
                          <div className="text-end">
                            <p className="mb-0">
                              Ordered on:{" "}
                              <span>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </p>
                            <p className="mb-0">
                              Status:{" "}
                              <span className="font-weight-bold text-success">
                                {order.status}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* 🔹 Progress Bar */}
                        <ul
                          id="progressbar-2"
                          className="d-flex justify-content-between mx-0 mt-0 mb-5 px-0 pt-0 pb-2"
                        >
                          {statusSteps.map((step, index) => (
                            <li
                              key={step}
                              className={`step0 text-center ${
                                index <= activeStepIndex ? "active" : ""
                              }`}
                              id={`step${index + 1}`}
                            ></li>
                          ))}
                        </ul>

                        {/* 🔹 Step Labels */}
                        <div className="d-flex justify-content-between">
                          {statusSteps.map((step, index) => (
                            <div className="d-lg-flex align-items-center" key={step}>
                              <i
                                className={`fas ${
                                  index === 0
                                    ? "fa-clipboard-list"
                                    : index === 1
                                    ? "fa-box-open"
                                    : index === 2
                                    ? "fa-shipping-fast"
                                    : "fa-home"
                                } fa-3x me-lg-4 mb-3 mb-lg-0`}
                              ></i>
                              <div>
                                <p className="fw-bold mb-1">{step}</p>
                                {/* <p className="fw-bold mb-0">{step}</p> */}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* 🔹 Product Info */}
                        <div className="mt-5">
                          <hr />
                          <div className="d-flex align-items-center">
                            <img
                              src={order.mainImage}
                              alt={order.title}
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                              className="me-3"
                            />
                            <div>
                              <h6 className="fw-bold">{order.title}</h6>
                              <p className="text-muted mb-1">
                                Quantity: {order.quantity}
                              </p>
                              <p className="fw-bold mb-0">Price: ${order.price}</p>
                            </div>
                          </div>
                        </div>
                        <hr />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderTracking;
