// server.js
const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const Product = require('./models/Products');
const port = process.env.PORT || 3000;
const authRoutes = require("./routes/auth.js");
const products = require("./routes/products.js");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const orderRoutes = require("./routes/orders");
const deliveryBoyRoutes = require("./routes/deliveryboy");
const env = require('dotenv');
const { Server } = require("socket.io");

env.config();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO (allow frontend origin(s))
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"], // add other origins if needed
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// make io available to routes
app.set("io", io);

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", products);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/delivery-boy", deliveryBoyRoutes);

// Socket events
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("joinDeliveryRoom", (deliveryBoyId) => {
    if (!deliveryBoyId) return;
    socket.join(`delivery:${deliveryBoyId}`);
    console.log(`Delivery boy ${deliveryBoyId} joined room delivery:${deliveryBoyId}`);
  });

  socket.on("joinPublic", () => {
    socket.join("publicOrders");
    console.log("Client joined room: publicOrders");
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// Example protected route placeholder
app.get("/api/profile", (req, res) => {
  res.json({ message: "Profile route (example)" });
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jeevan';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Root
app.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Start server
server.listen(port, () => {
  console.log(`🚀 Server + Socket.IO running on port ${port}`);
});
