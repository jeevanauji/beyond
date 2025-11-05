const express = require("express");
const Order = require("../models/Orders.js");

const router = express.Router();

// 🟢 Create new order
router.post("/placed", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// 🟡 Get all orders (admin use)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// 🔵 Get orders by user ID
router.get("/user/:id", async (req, res) => {
  try {
    const orders = await Order.find({ id: req.params.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
});

// GET single order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
