const CartController = require("./cart.controller");
const {
  validateAddItem,
  validateUpdateQuantity,
} = require("./cart.validation");

const cartRouter = require("express").Router();
cartRouter.post("/add", validateAddItem, CartController.addItem);
cartRouter.get("/", CartController.getCart);
cartRouter.patch(
  "/items/:productId",
  validateUpdateQuantity,
  CartController.updateQuantity
);
cartRouter.delete("/items/:productId", CartController.removeItem);

module.exports = cartRouter;
