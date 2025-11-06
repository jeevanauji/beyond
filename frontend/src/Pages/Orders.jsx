import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/api/orders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  useEffect(() => {
    fetchOrders();

    socket.emit("joinPublic");

    socket.on("newOrder", (newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
    });

    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
    });

    return () => {
      socket.off("newOrder");
      socket.off("orderUpdated");
    };
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Loading orders...</p>
      </div>
    );

  return (
    <section
      className="min-vh-100 py-7"
      style={{
        background: "linear-gradient(135deg, #f3f8ff, #eaf1ff)",
      }}
    >
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-primary">📦 Live Orders Dashboard</h2>
          <span className="badge bg-info text-dark fs-6">
            Total: {orders.length}
          </span>
        </div>

        {orders.length > 0 ? (
          <div className="table-responsive shadow-sm rounded">
            <table className="table table-hover align-middle text-center bg-white">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Placed On</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => {
                  const statusColor =
                    order.status === "Pending"
                      ? "warning"
                      : order.status === "Accepted"
                      ? "primary"
                      : order.status === "Out for Delivery"
                      ? "info"
                      : "success";

                  return (
                    <tr key={order._id} className="align-middle">
                      <td>{index + 1}</td>
                      <td className="fw-semibold">{order.name}</td>
                      <td className="text-muted">{order.email}</td>
                      <td>{order.title}</td>
                      <td>{order.quantity}</td>
                      <td>₹{order.price}</td>
                      <td>
                        <select
                          className={`form-select form-select-sm border-${statusColor}`}
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Out for Delivery">
                            Out for Delivery
                          </option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-muted mt-5">No orders found.</p>
        )}
      </div>
    </section>
  );
};

export default Orders;
