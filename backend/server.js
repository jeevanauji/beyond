const express = require('express');
const app = express();
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const Product = require('./models/Products');
const port = 3000;

app.use(express.json());
app.use(cors());
// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/jeevan')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));



app.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
