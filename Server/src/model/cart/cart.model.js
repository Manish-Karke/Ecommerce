const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  sessionId: {
    type: String,
    default: null,
  },
  items: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      priceAtAddition: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const CartModel = mongoose.model("Cart", cartSchema);
module.exports = CartModel;
