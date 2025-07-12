const brandSvs = require("./brand.service");

class BrandContoller {
  createBrand = async (req, res, next) => {
    try {
      const data = await brandSvs.transformBrandCreateData(req);
      console.log("data",data)
      await brandSvs.createBrand(data);

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

  deleteBrand = async (req, res, next) => {
    try {
      const id = req.params.id;
      const userDetail = await brandSvs.getSingleItemsByFilter({ _id: id });

      if (!userDetail) {
        res.json({
          message: " Enter the valid userDetail",
          status: 401,
          data: userDetail,
        });
      }
      res.json({
        message: "deleted sucessfully",
        status: 200,
        data: userDetail,
      });
    } catch (error) {
      throw error;
    }
  };

  updateBrand = async (req, res, next) => {
    try {
      const id = req.params.id;
      const payload = req.body;

      const brandDeatail = await brandSvs.getBrandsDetail({ _id: id });

      const updateData = await brandSvs.transformBrandUpdateData(
        req,
        brandDeatail
      );

      const updateDetail = await brandSvs.updateSingleItemByFilter(
        {
          _id: id,
        },
        updateData
      );
      if (!brandDeatail) {
        res.json({
          message: " Enter the valid userDetail",
          status: 401,
        });
      }
      res.json({
        message: " Updated sucessfully",

        data: updateDetail,
      });
    } catch (error) {
      throw error;
    }
  };

  searchAllBrands = async (req, res, next) => {
    try {
      const id = req.params.id;
      const brandDetail = await brandSvs.searchBrandById({ _id: id });
      if (brandDetail) {
        res.json({
          message: "your search is found",
          data: brandDetail,
        });
      }

      res.json({
        message: "enter the valid id",
      });
    } catch (error) {
      throw error;
    }
  };

  SearchBrandBySlug = async (req, res, next) => {
    try {
      const slug = req.params.slug; // for get request use params
      const slugValue = await brandSvs.searchBrandBySlug(slug);
      if (slugValue) {
        return res.json({
          message: "slug is searched",
          data: slugValue,
        });
      } else {
        return res.json({
          message: "pls enter the correct slug",
        });
      }
    } catch (error) {
      next(error);
    }
  };

  listAllBrands = async (req, res, next) => {
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
      const { data, pagination } = await brandSvs.getAllItemsByFilter(
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
const brandCtrl = new BrandContoller();
module.exports = brandCtrl;
