const CartModel = require("./cart.model");

const whoFilter = ({ userId, sessionId }) =>
  userId ? { userId } : { sessionId };

async function addItem({ userId, sessionId, items }) {
  const filter = whoFilter({ userId, sessionId });

  let cart = await CartModel.findOne(filter);

  if (!cart) {
    // Create new cart with items
    cart = await CartModel.create({ ...filter, items });
  } else {
    // Add items to existing cart
    for (const newItem of items) {
      const existingItemIndex = cart.items.findIndex(
        (cartItem) =>
          cartItem &&
          cartItem.productId.toString() === newItem.productId.toString()
      );

      if (existingItemIndex > -1) {
        // Item exists - increase quantity
        cart.items[existingItemIndex].quantity += newItem.quantity;
      } else {
        // New item - add to cart
        cart.items.push(newItem);
      }
    }
    await cart.save();
  }

  // Populate product details
  await cart.populate("items.productId", "name price images brandId");
  return cart;
}

async function getCart({ userId, sessionId }) {
  const filter = whoFilter({
    userId,
    sessionId,
  });
  return (
    CartModel.findOne(filter).populate(
      "items.productId",
      "name price images brandId"
    ) || { items: [] }
  );
}

async function updateQuantity({ userId, sessionId, productId, quantity }) {
  const filter = whoFilter({ userId, sessionId });

  const cart = await CartModel.findOne(filter);
  if (!cart) {
    throw new Error("Cart not found");
  }

  // Add the null check here
  const idx = cart.items.findIndex(
    (item) => item && item.productId.toString() === productId
  );

  if (idx === -1) {
    throw new Error("Item not in cart");
  }

  cart.items[idx].quantity = quantity;
  await cart.save();

  // You would also populate the cart here before returning it
  await cart.populate("items.productId", "name price images");

  return cart;
}
async function removeItem({ userId, sessionId, productId }) {
  const filter = whoFilter({
    userId,
    sessionId,
  });
  const cart = await CartModel.findOne(filter);
  if (!cart) throw new Error("cart is not found");

  cart.items = cart.items.filter((i) => i.productId !== productId);
  await cart.save();
  return cart;
}

module.exports = { addItem, getCart, updateQuantity, removeItem };
