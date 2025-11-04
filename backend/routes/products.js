const express = require("express");

const Product = require("../models/Products.js");

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.post("/add", async (req, res) => {
  const { title, description, mainImage, priceStart, thumbnails } = req.body;
  const newProduct = new Product({ title, description, mainImage, priceStart, thumbnails });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add product" });
  }
});
module.exports = router;