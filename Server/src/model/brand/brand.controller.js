const brandSvc = require("./brand.service");

class BrandContoller {
  createBrand = async (req, res, next) => {
    try {
      const data = await brandSvc.transformBrandCreateData(req);
      await brandSvc.createBrand(data);

      res.json({
        message: "brand is created successfully",
        status: 200,
        data: data,
        option: null,
      });
    } catch (error) {
      next(error);
    }
  };
}
const brandCtrl = new BrandContoller();
module.exports = brandCtrl;
