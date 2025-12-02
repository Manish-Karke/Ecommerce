const { userRoles } = require("../../config/const.config");
const { Roles } = require("../../config/constant");
const auth = require("../../middleware/middleware.auth");
const CartController = require("./cart.controller");
const {
  validateAddItem,
  validateUpdateQuantity,
} = require("./cart.validation");

const cartRouter = require("express").Router();
cartRouter.post("/add", validateAddItem,auth(userRoles.CUSTOMER), CartController.addItem);
cartRouter.get("/", auth(userRoles.CUSTOMER),CartController.getCart);
cartRouter.patch(
  "/items/:productId",
  validateUpdateQuantity,
  auth(userRoles.CUSTOMER),
  CartController.updateQuantity
);
cartRouter.delete("/items/:productId",auth(userRoles.CUSTOMER), CartController.removeItem);

module.exports = cartRouter;
