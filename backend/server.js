const express = require('express');
const app = express();
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const Product = require('./models/Products');
const port = 3000;
const authRoutes = require("./routes/auth.js");
const products = require("./routes/products.js");
const { verifyToken } = require("./middleware/auth.js");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const orderRoutes = require("./routes/orders");
const env = require('dotenv');
env.config();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes 
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", products);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);


// Example protected route
app.get("/api/profile", verifyToken, (req, res) => {
  res.json({ message: "Welcome to your profile!", user: req.user });
});

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/jeevan')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));



app.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
