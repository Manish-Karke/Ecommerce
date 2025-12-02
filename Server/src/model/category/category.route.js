const { userRoles } = require("../../config/const.config");
const { Roles } = require("../../config/constant");
const auth = require("../../middleware/middleware.auth");
const userValidator = require("../../middleware/middleware.validate");
const uploader = require("../../middleware/uploader.middleware");
const categoryCtrl = require("./category.controller");
const CategoryDataDTO = require("./category.validation");

const categoryRouter = require("express").Router();

categoryRouter
  .route("/")
  .post(
    auth(userRoles.ADMIN),
    uploader().single("image"),
    userValidator(CategoryDataDTO),
    categoryCtrl.createCategory
  )
  .get(categoryCtrl.showCategory);

module.exports = categoryRouter;
