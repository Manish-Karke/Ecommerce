const cartController = require("./cart.controller");
const {
  validateAddItem,
  validateUpdateQuantity,
} = require("./cart.validation");

const cartRouter = require("express").Router();
cartRouter.post("/", validateAddItem, cartController.addItem);
cartRouter.get("/cart", cartController.getCart);
cartRouter.patch(
  "/cart/items/:productId",
  validateUpdateQuantity,
  cartController.updateQuantity
);
cartRouter.delete("/cart/items/:productId", cartController.removeItem);

module.exports = cartRouter;
