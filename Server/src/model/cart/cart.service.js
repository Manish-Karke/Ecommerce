
const Cart = require("./cart.model");

class CartService {
  static getFilter({ userId, sessionId }) {
    if (!userId && !sessionId) {
      throw new Error("Either userId or sessionId is required");
    }
    return userId ? { userId } : { sessionId };
  }

  static async populateCart(cart) {
    if (!cart) return null;
    await cart.populate("items.productId", "name price images brandId");
    return cart;
  }

  static async addItem({ userId, sessionId, items }) {
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Items array is required");
    }

    const filter = this.getFilter({ userId, sessionId });

    let cart = await Cart.findOne(filter);

    if (!cart) {
      cart = new Cart({ ...filter, items });
    } else {
      for (const newItem of items) {
        const existingItem = cart.items.find(
          (item) => item.productId.toString() === newItem.productId.toString()
        );

        if (existingItem) {
          existingItem.quantity += newItem.quantity;
        } else {
          cart.items.push(newItem);
        }
      }
    }

    await cart.save();
    return this.populateCart(cart);
  }

 
  static async getCart({ userId, sessionId }) {
    const filter = this.getFilter({ userId, sessionId });
    const cart = await Cart.findOne(filter);
    return this.populateCart(cart) || { items: [], userId, sessionId };
  }


  static async updateQuantity({ userId, sessionId, productId, quantity }) {
    if (!productId) throw new Error("productId is required");
    if (!quantity || quantity < 1) throw new Error("quantity must be >= 1");

    const filter = this.getFilter({ userId, sessionId });
    const cart = await Cart.findOne(filter);

    if (!cart) throw new Error("Cart not found");

    const item = cart.items.find(
      (i) => i.productId.toString() === productId.toString()
    );

    if (!item) throw new Error("Item not found in cart");

    item.quantity = quantity;
    await cart.save();

    return this.populateCart(cart);
  }


  static async removeItem({ userId, sessionId, productId }) {
    const filter = this.getFilter({ userId, sessionId });
    const cart = await Cart.findOne(filter);

    if (!cart) throw new Error("Cart not found");

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== productId.toString()
    );

    if (cart.items.length === initialLength) {
      throw new Error("Item not found in cart");
    }

    await cart.save();
    return this.populateCart(cart);
  }

 
  static async clearCart({ userId, sessionId }) {
    const filter = this.getFilter({ userId, sessionId });
    await Cart.deleteOne(filter);
    return { message: "Cart cleared", items: [] };
  }
}

module.exports = CartService;
