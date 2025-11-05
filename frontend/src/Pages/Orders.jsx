import axios from "axios";
import React, { useEffect, useState } from "react";

const Orders = () => {
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orders = await axios.get("http://localhost:3000/api/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
        console.log(orders.data);
        setOrder(orders.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrder();
  }, []);

  return (
    <div>
      <h1>Your Orders</h1>
      {order ? (
        <ul>
          {order.map((item) => (
            <li key={item._id}>
              {item.title}
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default Orders;
