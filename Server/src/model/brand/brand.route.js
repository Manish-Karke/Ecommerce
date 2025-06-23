const { Roles } = require("../../config/constant");
const userValidator = require("../../middleware/middleware.validate");
const uploader = require("../../middleware/uploader.middleware");
const brandCtrl = require("./brand.controller");
const BrandDataDTO = require("./brand.validation");

const brandRouter = require("express").Router();
brandRouter.post(
  "/",
  // auth(Roles.ADMIN),
  uploader().single("logo"),
  userValidator(BrandDataDTO),
  brandCtrl.createBrand
);

module.exports = brandRouter;
