const CartService = require("./cart.service");

class CartController {
  static async addItem(req, res) {
    try {
      const { userId, sessionId, items } = req.body;

      const cart = await CartService.addItem({ userId, sessionId, items });

      res.status(200).json({
        success: true,
        message: "Items added to cart",
        data: cart,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getCart(req, res) {
    try {
      const { userId, sessionId } = req.query;
      const cart = await CartService.getCart({ userId, sessionId });

      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async updateQuantity(req, res) {
    try {
      const { userId, sessionId, productId, quantity } = req.body;

      if (!productId || quantity === undefined) {
        return res.status(400).json({
          success: false,
          error: "productId and quantity are required",
        });
      }

      const cart = await CartService.updateQuantity({
        userId,
        sessionId,
        productId,
        quantity,
      });

      res.status(200).json({
        success: true,
        message: "Quantity updated",
        data: cart,
      });
    } catch (error) {
      res.status(error.message.includes("not found") ? 404 : 400).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async removeItem(req, res) {
    try {
      const { userId, sessionId } = req.body;
      const { productId } = req.params;

      const cart = await CartService.removeItem({
        userId,
        sessionId,
        productId,
      });

      res.status(200).json({
        success: true,
        message: "Item removed from cart",
        data: cart,
      });
    } catch (error) {
      res.status(error.message.includes("not found") ? 404 : 400).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = CartController;
