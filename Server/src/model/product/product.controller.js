// controllers/product.controller.js
const productSvc = require("./product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    try {
      const payload = await productSvc.transformCreateProduct(req);
      const product = await productSvc.createProduct(payload);

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  // Now supports: ?search=phone&categoryId=abc&brandId=xyz,xyz&minPrice=100&maxPrice=500&sortBy=price_low
  GetAllProductList = async (req, res, next) => {
    try {
      const { data, pagination } = await productSvc.listAllProduct(
        {},
        req.query
      );

      res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data,
        pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  listProductById = async (req, res, next) => {
    try {
      const product = await productSvc.getProductById(req.params.id);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProductById = async (req, res, next) => {
    try {
      const oldProduct = await productSvc.getProductById(req.params.id);
      if (!oldProduct) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      const payload = await productSvc.transformUpdateProductData(
        req,
        oldProduct
      );
      const updated = await productSvc.updateProductById(
        req.params.id,
        payload
      );

      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteProductById = async (req, res, next) => {
    try {
      const product = await productSvc.getProductById(req.params.id);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      await productSvc.deleteProductById(req.params.id);

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

const productCtrl = new ProductController();
module.exports = productCtrl;
