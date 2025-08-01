const express = require("express");
const productModel = require("../models/product.model");
const ImageKit = require("imagekit");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await productModel.find().sort({ createdAt: -1 });
    res.status(200).json({ 
      message: "Products found", 
      products,
      count: products.length 
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Search products by title
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }
    
    const products = await productModel.find({
      title: { $regex: q, $options: 'i' }
    }).sort({ createdAt: -1 });
    
    res.status(200).json({ 
      message: "Search results", 
      products,
      count: products.length,
      query: q
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const imagekit = new ImageKit({
      publicKey: process.env.PUBLIC_KEY,
      privateKey: process.env.PRIVATE_KEY,
      urlEndpoint: process.env.URL_ENDPOINT,
    });

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      isPrivateFile: false,
      isPublished: true
    });

    const imageUrl = result.url;
    const { title, description, category, price } = req.body;
    
    const product = new productModel({
      title: title,
      description: description,
      category: category,
      price: price,
      image: imageUrl
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: "Failed to add product" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.status(200).json({ message: "Product found", product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/update/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.render("updateForm", { product: product });
  } catch (error) {
    console.error('Error fetching product for update:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const productId = req.params.id;
    const { title, description, category, price } = req.body;
    
    let updateData = { title, description, category, price };
    
    if (req.file) {
      const imagekit = new ImageKit({
        publicKey: process.env.PUBLIC_KEY,
        privateKey: process.env.PRIVATE_KEY,
        urlEndpoint: process.env.URL_ENDPOINT,
      });

      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        isPrivateFile: false,
        isPublished: true
      });

      updateData.image = result.url;
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      productId, 
      updateData,
      { new: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.redirect(`/products/${productId}`);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: "Failed to update product" });
  }
});

// DELETE route for API
router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await productModel.findByIdAndDelete(productId);
    
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.status(200).json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/delete/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await productModel.findByIdAndDelete(productId);
    
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.redirect("/");
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
