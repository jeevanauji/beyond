import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const DeliveryBoyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("deliveryBoyToken");

  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/orders/delivery-boy/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const filtered = res.data.filter(
        (order) =>
          order.status === "Accepted" ||
          order.status === "Out for Delivery" ||
          order.status === "Delivered"
      );

      setOrders(filtered);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/orders/delivery-boy/orders/${orderId}/status`,
        { newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update status.");
    }
  };

  useEffect(() => {
    const decoded = decodeToken(token);
    if (!decoded?.id) return;

    const socket = io("http://localhost:3000", { transports: ["websocket"] });
    socket.emit("joinDeliveryRoom", decoded.id);

    fetchOrders();

    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  if (loading)
    return <p className="text-center mt-5">Loading accepted orders...</p>;
  if (error)
    return (
      <div className="alert alert-danger text-center mt-3" role="alert">
        {error}
      </div>
    );

  return (
    <div className="container py-7">
      <h3 className="text-center mb-4">🚴 My Active Orders</h3>

      {orders.length === 0 ? (
        <p className="text-center text-muted">No accepted orders yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Address</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Status</th>
                <th>Change Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={order._id}>
                  <td>{i + 1}</td>
                  <td>{order.name}</td>
                  <td>{order.address}</td>
                  <td>{order.title}</td>
                  <td>{order.quantity}</td>
                  <td>₹{order.price}</td>
                  <td>
                    <span
                      className={`badge ${
                        order.status === "Accepted"
                          ? "bg-primary"
                          : order.status === "Out for Delivery"
                          ? "bg-warning text-dark"
                          : "bg-success"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {order.status === "Delivered" ? (
                      <button className="btn btn-sm btn-success" disabled>
                        Delivered
                      </button>
                    ) : (
                      <select
                        className="form-select form-select-sm"
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                      >
                        <option value="Accepted">Accepted</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeliveryBoyOrders;
