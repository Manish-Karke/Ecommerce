const { default: userRouter } = require("../model/auth/auth.config");
const brandRouter = require("../model/brand/brand.route");
const cartRouter = require("../model/cart/cart.route");
const categoryRouter = require("../model/category/category.route");
const productRouter = require("../model/product/product.route");

const homeRouter = require("express").Router();

homeRouter.use(userRouter);
homeRouter.use("/brand", brandRouter);

homeRouter.use("/category", categoryRouter);

homeRouter.use("/product", productRouter);
homeRouter.use("/cart", cartRouter);
module.exports = homeRouter;
