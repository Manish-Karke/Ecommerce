const cartService = require("./cart.service");

exports.addItem = async (req, res) => {
  try {
    const { userId, sessionId, items } = req.body;

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Items array is required and cannot be empty",
      });
    }

    if (!userId && !sessionId) {
      return res.status(400).json({
        error: "Either userId or sessionId is required",
      });
    }

    // Use the service to add items
    const cart = await cartService.addItem({ userId, sessionId, items });

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({
      error: "Failed to add item to cart",
    });
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
    const { userId, sessionId, items } = req.body;
    const { productId, quantity } = items[0]; // Assume single item update
    console.log("productId", productId);

    const cart = await cartService.updateQuantity({
      userId,
      sessionId,
      productId,
      quantity,
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart or item not found" });
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error("Error in updateQuantity:", err);
    if (
      err.message === "Cart not found" ||
      err.message === "Item not in cart"
    ) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({
      error: "An internal server error occurred",
      details: err.message,
    });
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
