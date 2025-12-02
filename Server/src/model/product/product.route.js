const { userRoles } = require("../../config/const.config");
const { Roles } = require("../../config/constant");
const auth = require("../../middleware/middleware.auth");
const userValidator = require("../../middleware/middleware.validate")
const uploader = require("../../middleware/uploader.middleware");
const productCtrl = require("./product.controller");
const {ProductValidationDTO, ProductUpdateValidationDTO} = require("./product.validation");
const productRouter = require("express").Router();

// private
productRouter.route("/")
  .post(auth(userRoles.ADMIN),uploader().array("images",5),userValidator(ProductValidationDTO),productCtrl.createProduct)
  .get( productCtrl.GetAllProductList);

//listing of all the proudct

productRouter
  .route("/:id")
  .get( productCtrl.listProductById)
  .put(
    auth(userRoles.ADMIN),
    uploader().array("images"),
    userValidator(ProductUpdateValidationDTO),
    productCtrl.updateProductById
  )
  .delete(auth(userRoles.ADMIN), productCtrl.deleteProductById);

module.exports = productRouter;
