const userValidator = require("../../middleware/middleware.validate");
const uploader = require("../../middleware/uploader.middleware");
const productCtrl = require("./product.controller");
const ProductValidationDTO = require("./product.validation");

const productRouter = require("express").Router();
productRouter
  .route("/")
  .post(
    uploader().array("images"),
    userValidator(ProductValidationDTO),
    productCtrl.createProduct
  )
  .get(productCtrl.GetAllProductList);

productRouter.route("/:id").get(productCtrl.listProductById);

module.exports = productRouter;
