const productSvc = require("./product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    try {
      const userDetails = await productSvc.transformCreateProduct(req);
      const data = await productSvc.createProduct(userDetails);

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

  //get all produdt
  GetAllProductLIst = async (req, res, next) => {
    try {
      let filter = {};
      if (req.query.status) {
        filter = {
          ...filter,
          status: req.query.status,
        };
      }
      if (req.query.search) {
        filter = {
          ...filter,
          name: RegExp(req.query.search, "i"),
        };
      }
      const { data, pagination } = await productSvc.listAllProduct(
        filter,
        req.query
      );
      res.json({
        data: data,
        status: 200,
        message: "product has been listed",
        options: pagination,
      });
    } catch (error) {
      next(error);
    }
  };
  //just by passing id

  //target->params
  //serching->query
  //create/update->body
  listProductById = async (req, res, next) => {
    try {
      const params = req.params.id;

      const userDetail = await productSvc.getProductById({ _id: params });
      if (!userDetail) {
        res.json({
          message: "product id is not listed",
          status: 400,
        });
      }
      res.json({
        data: userDetail,
        message: "you data is listed",
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProductById = async (req, res, next) => {
    try {
      const id = req.params.id;

      const userDetail = await productSvc.getProductById({_id: id});

      if(!userDetail){
        throw {
          status: 422,
          message: "Invalid Id"
        }
      }

      const transformedDetail = await productSvc.transformUpdateProductData(req, userDetail)
      const updatedData = await productSvc.updateProductById({_id: userDetail._id}, transformedDetail);

      res.json({
        data: updatedData,
        status: 200,
        message: "Successfully updated",
        options: null,
      })
    } catch (error) {
      throw error
    }
  }

  deleteProductById = async (req, res, next) => {
    try {
      const params = req.params.id;
      const userDetail = await productSvc.getProductById({ _id: params });

      if (!userDetail) {
        throw {
          message: "invalid Id",
          status: 404,
        };
      }
      await productSvc.deleteProductById({
        _id: userDetail.id,
      });
      res.json({
        message: "Product sucessfully Deleted",
        status: 200,
        data: userDetail,
        option: null,
      });
    } catch (error) {
      next(error);
    }
  };
}

const productCtrl = new ProductController();

module.exports = productCtrl;
