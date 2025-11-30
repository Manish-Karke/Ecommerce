const auth = require("../../middleware/middleware.auth");
const userValidator = require("../../middleware/middleware.validate")
const uploader = require("../../middleware/uploader.middleware");
const productCtrl = require("./product.controller");
const {ProductValidationDTO, ProductUpdateValidationDTO} = require("./product.validation");
const productRouter = require("express").Router();

// private
productRouter.route("/")
  .post(auth(),uploader().array("images"),userValidator(ProductValidationDTO),productCtrl.createProduct)
  .get(auth(), productCtrl.GetAllProductList);

//listing of all the proudct

productRouter
  .route("/:id")
  .get(auth(), productCtrl.listProductById)
  .put(
    auth(),
    uploader().array("images"),
    userValidator(ProductUpdateValidationDTO),
    productCtrl.updateProductById
  )
  .delete(auth(), productCtrl.deleteProductById);

module.exports = productRouter;
