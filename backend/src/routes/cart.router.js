const express = require("express");
const cartModel = require("../models/cart.model");
const router = express.Router();

// GET /cart with product details
router.get("/", async (req, res) => {
    try {
        const cartItems = await cartModel.find().populate("productId"); // Populate the product details
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch cart items" });
    }
});

// POST /cart/add
router.post("/add/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({ error: "productId is required" });
        }

        // Check if product already exists in cart
        const existingCartItem = await cartModel.findOne({ productId });

        if (existingCartItem) {
            // Update quantity if product already exists
            existingCartItem.quantity += quantity;
            await existingCartItem.save();
            res.status(200).json({ message: "Cart updated", cartItem: existingCartItem });
        } else {
            // Add new item to cart
            const cartItem = new cartModel({ productId, quantity });
            await cartItem.save();
            res.status(201).json({ message: "Product added to cart", cartItem });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// PUT /cart/update/:productId
router.put("/update/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!productId || quantity === undefined) {
            return res.status(400).json({ error: "productId and quantity are required" });
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            await cartModel.findOneAndDelete({ productId });
            res.status(200).json({ message: "Item removed from cart" });
        } else {
            // Update quantity
            const updatedCartItem = await cartModel.findOneAndUpdate(
                { productId },
                { quantity },
                { new: true }
            );
            res.status(200).json({ message: "Cart updated", cartItem: updatedCartItem });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// DELETE /cart/remove/:productId
router.delete("/remove/:productId", async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({ error: "productId is required" });
        }

        await cartModel.findOneAndDelete({ productId });
        res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// DELETE /cart/clear
router.delete("/clear", async (req, res) => {
    try {
        await cartModel.deleteMany({});
        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
