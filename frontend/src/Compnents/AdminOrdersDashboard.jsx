// AdminOrdersDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", { transports: ["websocket"] });

const AdminOrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (id, decision) => {
    try {
      await axios.post(`http://localhost:3000/api/orders/admin/orders/${id}/approve`, { decision });
      alert(`Request ${decision}`);
      fetchOrders();
    } catch (err) {
      console.error("Error approving:", err);
      alert(err.response?.data?.message || "Failed to update request");
    }
  };

  useEffect(() => {
    fetchOrders();

    socket.emit("joinPublic");

    socket.on("newOrder", (newOrder) => {
      console.log("Admin got new order:", newOrder);
      setOrders((prev) => [newOrder, ...prev]);
    });

    socket.on("deliveryRequest", (data) => {
      console.log("New delivery request:", data);
      // Optionally show toast/alert
      fetchOrders();
      // You can also show a visual highlight for the order using local state
    });

    socket.on("orderUpdated", (updatedOrder) => {
      console.log("Admin order updated:", updatedOrder);
      setOrders((prev) =>
        prev.map((o) => (String(o._id) === String(updatedOrder._id) ? updatedOrder : o))
      );
    });

    socket.on("deliveryRequestResponse", (data) => {
      console.log("deliveryRequestResponse:", data);
      // if you want to show responses on admin dashboard too
      fetchOrders();
    });

    return () => {
      socket.off("newOrder");
      socket.off("deliveryRequest");
      socket.off("orderUpdated");
      socket.off("deliveryRequestResponse");
    };
  }, []);

  if (loading) return <p className="text-center mt-5">Loading admin orders...</p>;

  return (
    <div className="container py-7">
      <h2 className="text-center mb-4">🧾 Admin Orders Dashboard</h2>

      {orders.length === 0 ? (
        <p className="text-center">No orders yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Address</th>
                <th>Product</th>
                <th>Price</th>
                <th>Status</th>
                <th>Delivery Boy</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
                  <td>{order.name}</td>
                  <td>{order.address}</td>
                  <td>{order.title}</td>
                  <td>₹{order.price}</td>
                  <td>
                    <span
                      className={`badge ${
                        order.status === "Pending"
                          ? "bg-warning text-dark"
                          : order.status === "Accepted"
                          ? "bg-primary"
                          : order.status === "Out for Delivery"
                          ? "bg-info"
                          : "bg-success"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{order.assignedTo ? "Assigned" : "Unassigned"}</td>
                  <td>
                    {order.deliveryRequest?.status === "Pending" ? (
                      <>
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => approveRequest(order._id, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => approveRequest(order._id, "Rejected")}
                        >
                          Reject
                        </button>
                      </>
                    ) : order.status === "Pending" ? (
                      <span className="text-muted">No Requests</span>
                    ) : (
                      <span>-</span>
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

export default AdminOrdersDashboard;
