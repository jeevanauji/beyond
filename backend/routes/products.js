const express = require("express");
const multer = require("multer");
const path = require("path");
const Product = require("../models/Products.js");

const router = express.Router();
const BASE_URL = "http://localhost:3000";
// Configure Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Folder to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage });

// Route to fetch all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.post("/add", upload.fields([{ name: "pimage", maxCount: 1 }, { name: "pthumbnail", maxCount: 5 }]), async (req, res) => {
  try {
    const { title, description, priceStart } = req.body;

      const normalizePath = (p) => p.replace(/\\/g, "/");

      // Build full URLs with BASE_URL
      const mainImage = req.files.pimage
        ? `${BASE_URL}/${normalizePath(req.files.pimage[0].path)}`
        : "";

      const thumbnails = req.files.pthumbnail
        ? req.files.pthumbnail.map(
          (file) => `${BASE_URL}/${normalizePath(file.path)}`
        )
        : [];

      const newProduct = new Product({
        title,
        description,
        priceStart,
        mainImage,
        thumbnails,
      });

      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (err) {
      console.error("Error saving product:", err);
      res.status(500).json({ error: "Failed to add product" });
    }
  }
);


module.exports = router;
