const CartModel = require("./cart.model");

const whoFilter = ({ userId, sessionId }) =>
  userId ? { userId } : { sessionId };

// async function addItem({ userId, sessionId, items }) {
//   const filter = whoFilter({ userId, sessionId });

//   let cart = await CartModel.findOne(filter);

//   if (!cart) {
//     // Create new cart with items
//     cart = await CartModel.create({ ...filter, items });
//   } else {
//     // Add items to existing cart
//     for (const newItem of items) {
//       const existingItemIndex = cart.items.findIndex(
//         (cartItem) =>
//           cartItem &&
//           cartItem.productId.toString() === newItem.productId.toString()
//       );

//       if (existingItemIndex > -1) {
//         // Item exists - increase quantity
//         cart.items[existingItemIndex].quantity += newItem.quantity;
//       } else {
//         // New item - add to cart
//         cart.items.push(newItem);
//       }
//     }
//     await cart.save();
//   }

//   // Populate product details
//   await cart.populate("items.productId", "name price images brandId");
//   return cart;
// }
async function addItem({ userId, sessionId, items }) {
  try {
    console.log("=== ADD ITEM DEBUG ===");
    console.log("Input params:", { userId, sessionId, items });

    // Validation
    if (!userId && !sessionId) {
      throw new Error("Either userId or sessionId is required");
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Items must be a non-empty array");
    }

    // Validate each item
    for (const item of items) {
      if (!item.productId) {
        throw new Error("Each item must have a productId");
      }
      if (!item.quantity || item.quantity <= 0) {
        throw new Error("Each item must have quantity > 0");
      }
    }

    const filter = whoFilter({ userId, sessionId });
    let cart = await CartModel.findOne(filter);

    if (!cart) {
      // Create new cart
      console.log("Creating new cart...");
      cart = await CartModel.create({ ...filter, items });
    } else {
      // Update existing cart
      console.log("Updating existing cart...");

      for (const newItem of items) {
        const existingItemIndex = cart.items.findIndex(
          (cartItem) =>
            cartItem &&
            cartItem.productId.toString() === newItem.productId.toString()
        );

        if (existingItemIndex > -1) {
          // Item exists - increase quantity
          cart.items[existingItemIndex].quantity += newItem.quantity;
          console.log(`Updated quantity for ${newItem.productId}`);
        } else {
          // New item - add to cart
          cart.items.push(newItem);
          console.log(`Added new item ${newItem.productId}`);
        }
      }

      await cart.save();
    }

    // Populate product details
    await cart.populate("items.productId", "name price images brandId");
    console.log("=== ADD ITEM SUCCESS ===");

    return cart;
  } catch (error) {
    console.error("=== ADD ITEM ERROR ===");
    console.error("Error:", error.message);
    throw error;
  }
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
