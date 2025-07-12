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
brandRouter
  .route("/:id")
  .put(
    // auth(Roles.ADMIN),
    uploader().single("logo"),
    userValidator(BrandDataDTO),
    brandCtrl.updateBrand
  )
  .delete(
    // auth(Roles.ADMIN),
    brandCtrl.deleteBrand
  )
  .get(
    // auth(),
   brandCtrl.searchAllBrands);

brandRouter.route("/slug/:slug").get(
  // auth(),
  brandCtrl.SearchBrandBySlug
);

brandRouter.get(
  "/",
  // auth(),
  brandCtrl.listAllBrands
);
module.exports = brandRouter;
