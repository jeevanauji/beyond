// routes/orders.js
const express = require("express");
const jwt = require("jsonwebtoken");
const Order = require("../models/Orders.js");

const router = express.Router();

// Middleware: verify delivery boy JWT token
const verifyDeliveryBoy = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.deliveryBoyId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ------------------------- Order endpoints -------------------------

// Create new order (from user)
router.post("/placed", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // Emit to public orders room so delivery boys/admin receive it
    const io = req.app.get("io");
    if (io) io.to("publicOrders").emit("newOrder", order);

    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Get all orders (admin use)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Get single order
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

// ADMIN: Update order status (general admin endpoint)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

    // Emit socket event (to public + assigned delivery boy)
    const io = req.app.get("io");
    if (io) {
      io.to("publicOrders").emit("orderUpdated", updatedOrder);
      if (updatedOrder.assignedTo) {
        io.to(`delivery:${String(updatedOrder.assignedTo)}`).emit("orderUpdated", updatedOrder);
      }
    }

    res.json({ success: true, message: "Order status updated", updatedOrder });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

// DELIVERY-BOY: Get orders visible to the delivery boy (assigned + unassigned)
router.get("/delivery-boy/orders", verifyDeliveryBoy, async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ assignedTo: req.deliveryBoyId }, { assignedTo: null }],
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching delivery orders:", err);
    res.status(500).json({ message: "Failed to fetch delivery orders" });
  }
});

// DELIVERY-BOY: Request to accept an order (sends notification to admin)
router.post("/delivery-boy/orders/:id/request", verifyDeliveryBoy, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.assignedTo) {
      return res.status(400).json({ message: "Order already assigned" });
    }

    // Set delivery request
    order.deliveryRequest = {
      deliveryBoy: req.deliveryBoyId,
      status: "Pending",
    };
    await order.save();

    const io = req.app.get("io");
    if (io) {
      // Notify admin/public room about request
      io.to("publicOrders").emit("deliveryRequest", {
        orderId: order._id,
        deliveryBoyId: req.deliveryBoyId,
        status: "Pending",
      });

      // Optionally send to the specific delivery boy too (so they get confirmation)
      io.to(`delivery:${req.deliveryBoyId}`).emit("requestSent", { orderId: order._id });
    }

    res.json({ success: true, message: "Request sent to admin", order });
  } catch (err) {
    console.error("Error sending request:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELIVERY-BOY: Accept after admin approval (kept for backward compatibility if needed)
router.post("/delivery-boy/orders/:id/accept", verifyDeliveryBoy, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.assignedTo) {
      return res.status(400).json({ message: "Order already accepted" });
    }

    order.status = "Accepted";
    order.assignedTo = req.deliveryBoyId;
    order.deliveryRequest = { deliveryBoy: req.deliveryBoyId, status: "Approved" };
    await order.save();

    const io = req.app.get("io");
    if (io) {
      io.to("publicOrders").emit("orderUpdated", order);
      io.to(`delivery:${req.deliveryBoyId}`).emit("orderUpdated", order);
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error("Error accepting order:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELIVERY-BOY: Update order status (e.g., Out for Delivery, Delivered)
router.put("/delivery-boy/orders/:id/status", verifyDeliveryBoy, async (req, res) => {
  try {
    const { newStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (String(order.assignedTo) !== String(req.deliveryBoyId)) {
      return res.status(403).json({ message: "Not authorized for this order" });
    }

    order.status = newStatus;
    await order.save();

    const io = req.app.get("io");
    if (io) {
      io.to(`delivery:${req.deliveryBoyId}`).emit("orderUpdated", order);
      io.to("publicOrders").emit("orderUpdated", order);
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

// ADMIN: Approve or reject delivery request
router.post("/admin/orders/:id/approve", async (req, res) => {
  try {
    const { decision } = req.body; // "Approved" or "Rejected"
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.deliveryRequest.status !== "Pending") {
      return res.status(400).json({ message: "No pending request found" });
    }

    order.deliveryRequest.status = decision === "Approved" ? "Approved" : "Rejected";

    if (decision === "Approved") {
      order.assignedTo = order.deliveryRequest.deliveryBoy;
      order.status = "Accepted";
    } else {
      // clear deliveryRequest (or set Rejected)
      // keep deliveryRequest.deliveryBoy so admin/historic knows who requested
    }

    await order.save();

    const io = req.app.get("io");
    if (io) {
      // Notify the requesting delivery boy specifically
      if (order.deliveryRequest.deliveryBoy) {
        io.to(`delivery:${String(order.deliveryRequest.deliveryBoy)}`).emit("orderUpdated", order);
        io.to(`delivery:${String(order.deliveryRequest.deliveryBoy)}`).emit("deliveryRequestResponse", {
          orderId: order._id,
          decision: order.deliveryRequest.status,
        });
      }

      // Update public/admin dashboards
      io.to("publicOrders").emit("orderUpdated", order);
      io.to("publicOrders").emit("deliveryRequestResponse", { orderId: order._id, decision: order.deliveryRequest.status });
    }

    res.json({ success: true, message: `Request ${order.deliveryRequest.status}`, order });
  } catch (err) {
    console.error("Error approving request:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const orders = await Order.find({ id: req.params.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
});


module.exports = router;
