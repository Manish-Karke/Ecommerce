const cartService = require("./cart.service");

exports.addItem = async (req, res) => {
  try {
    const { userId, sessionId, items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "The 'items' field must be a non-empty array." });
    }

    const cart = await cartService.addItem({ userId, sessionId, items });
    res.status(200).json({ message: "Items added to cart", data: cart });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

exports.getCart = async (req, res) => {
  try {
    const { userId, sessionId } = req.query;
    const cart = await cartService.getCart({ userId, sessionId });
    res.status(200).json({ data: cart });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { userId, sessionId, quantity } = req.body;
    const { productId } = req.params;
    const cart = await cartService.updateQuantity({
      userId,
      sessionId,
      productId,
      quantity,
    });
    res.status(200).json({ message: "Quantity updated", data: cart });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const { userId, sessionId } = req.body;
    const { productId } = req.params;
    const cart = await cartService.removeItem({ userId, sessionId, productId });
    res.status(200).json({ message: "Item removed", data: cart });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
