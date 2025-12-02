const { userRoles } = require("../../config/const.config");
const { Roles } = require("../../config/constant");
const auth = require("../../middleware/middleware.auth");
const userValidator = require("../../middleware/middleware.validate");
const uploader = require("../../middleware/uploader.middleware");
const brandCtrl = require("./brand.controller");
const BrandDataDTO = require("./brand.validation");

const brandRouter = require("express").Router();
brandRouter.post(
  "/",
  auth(userRoles.ADMIN),
  uploader().single("logo"),
  userValidator(BrandDataDTO),
  brandCtrl.createBrand
);
brandRouter
  .route("/:id")
  .put(
    auth(userRoles.ADMIN),
    uploader().single("logo"),
    userValidator(BrandDataDTO),
    brandCtrl.updateBrand
  )
  .delete(
    auth(userRoles.ADMIN),
    brandCtrl.deleteBrand
  )
  .get(

   brandCtrl.searchAllBrands);

brandRouter.route("/slug/:slug").get(

  brandCtrl.SearchBrandBySlug
);

brandRouter.get(
  "/",
  brandCtrl.listAllBrands
);
module.exports = brandRouter;
