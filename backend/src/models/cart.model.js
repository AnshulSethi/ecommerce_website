const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "product", 
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const cartModel = mongoose.model("Cart", cartSchema);

module.exports = cartModel;
