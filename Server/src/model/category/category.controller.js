const categorySvs = require("./category.service");

class categoryContoller {
  createCategory = async (req, res, next) => {
    try {
      const userDetail = await categorySvs.tranforCreateBrandData(req);

      await categorySvs.createCategory(userDetail);

      res.json({
        message: "new category is created",
        data: userDetail,
        status: 200,
        options: null,
      });
      if (!userDetail) {
        res.json({
          message: "enter the valid details",
        });
      }
    } catch (error) {
      next(error);
    }
  };
  showCategory = async (req, res, next) => {
    try {
      let filter = {};
      if (req.query.search) {
        filter = {
          ...filter,
          name: new RegExp(req.query.search, "i"),
        };
      }
      if (req.query.status) {
        filter = {
          ...filter,
          status: req.query.status,
        };
      }

      const { data, pagination } = await categorySvs.getAllCategory(
        filter,
        req.query
      );
      res.json({
        data: data,
        options: pagination,
        message: "Listing of brand data has been sucessfully Listed",
        status: 200,
      });
    } catch (error) {
      throw error;
    }
  };
}
const categoryCtrl = new categoryContoller();
module.exports = categoryCtrl;
