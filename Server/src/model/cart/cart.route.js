const cartController = require("./cart.controller");
const {
  validateAddItem,
  validateUpdateQuantity,
} = require("./cart.validation");

const cartRouter = require("express").Router();
cartRouter.post("/", validateAddItem, cartController.addItem);
cartRouter.get("/", cartController.getCart);
cartRouter.patch(
  "/items/:productId",
  validateUpdateQuantity,
  cartController.updateQuantity
);
cartRouter.delete("/items/:productId", cartController.removeItem);

module.exports = cartRouter;
