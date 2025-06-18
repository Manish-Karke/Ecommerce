const { default: userRouter } = require("../model/auth/auth.config");

const homeRouter = require("express").Router();

homeRouter.use(userRouter)

module.exports = homeRouter;
