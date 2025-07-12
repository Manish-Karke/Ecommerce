const userValidator = require("../../middleware/middleware.validate");
const uploader = require("../../middleware/uploader.middleware");
const categoryCtrl = require("./category.controller");
const CategoryDataDTO = require("./category.validation");

const categoryRouter = require("express").Router();

categoryRouter
  .route("/")
  .post(
    //auth()
    uploader().single("image"),
    userValidator(CategoryDataDTO),
    categoryCtrl.createCategory
  );

module.exports = categoryRouter;
