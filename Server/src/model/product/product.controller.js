const productSvs = require("./product.service");

class ProductContoller {
 createProduct = async (req, res, next) => {
    try {
      const userDetails = await productSvs.transformCreateProduct(req);
      const data = await productSvs.createProduct(userDetails);

      res.json({
        data: data,
        status: 200,
        messages: "Product Created Successfully",
        options: null,
      });
    } catch (error) {
      next(error);
    }
  };

  
}
const productCtrl = new ProductContoller();
module.exports = productCtrl;
