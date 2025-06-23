const { default: userRouter } = require("../model/auth/auth.config");
const brandRouter = require("../model/brand/brand.route");

const homeRouter = require("express").Router();

homeRouter.use(userRouter)
homeRouter.use("/brand",brandRouter)
module.exports = homeRouter;
