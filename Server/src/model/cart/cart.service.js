const CartModel = require("./cart.model");

const whoFilter = ({ userId, sessionId }) =>
  userId ? { userId } : { sessionId };

async function addItem({ userId, sessionId, items }) {
  console.log("Received items:", items);
  const filter = userId ? { userId } : { sessionId };
  console.log("Using filter:", filter);

  // This is the most likely failure point
  let cart = await CartModel.findOne(filter);
  console.log("Found cart:", cart); // Check if cart is null or a document
  // You must have `productId` as a string in the incoming `items` array
  const productsToAdd = items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    priceAtAddition: item.priceAtAddition,
  }));

  if (!cart) {
    console.log("No cart found, creating a new one...");
    cart = await CartModel.create({ ...filter, items });
    console.log("New cart created:", cart);
  } else {
    console.log("Cart found, adding/updating items...");
    for (const newItem of items) {
      console.log("Processing new item:", newItem);
      const existingItemIndex = cart.items.findIndex(
        (cartItem) => cartItem && cartItem.productId === newItem.productId // <-- Add the check here
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += newItem.quantity;
      } else {
        cart.items.push(newItem);
      }
    }
    await cart.save();
    console.log("Cart saved.");
  }
  await cart.populate("items.productId", "name price images brandId");
  return cart;
}
async function getCart({ userId, sessionId }) {
  const filter = whoFilter({
    userId,
    sessionId,
  });
  return CartModel.findOne(filter) || { items: [] };
}

async function updateQuantity({ userId, sessionId, productId, quantity }) {
  const filter = whoFilter({ userId, sessionId });
  const cart = await CartModel.findOne(filter);
  if (!cart) throw new Error("cart is not found");
  const idx = cart.items.findIndex((i) => i.productId === productId);
  if (idx === -1) throw new Error("Item not in cart");

  cart.items[idx].quantity = quantity;
  await cart.save();
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
