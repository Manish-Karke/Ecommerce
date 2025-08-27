const userValidator = require("../../middleware/middleware.validate");
const cartCtrl = require("./cart.controller");
const { createCartSchema } = require("./cart.validation");

const cartRouter = require("express").Router();
cartRouter.post("/", userValidator(createCartSchema), cartCtrl.createCart);

module.exports = cartRouter;
