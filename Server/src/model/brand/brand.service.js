const cloudinarySvs = require("../../ServiceBack/cloudinary.service");
const BrandModel = require("./brand.model");
const { default: slugify } = require("slugify");
class BrandServices {
  createBrand = async (data) => {
    try {
      const brand = new BrandModel(data);
      return await brand.save();
    } catch (error) {
      throw error;
    }
  };

  getSingleItemsByFilter = async (data) => {
    try {
      const userDetail = await BrandModel.findOneAndDelete(data);
      return userDetail;
    } catch (error) {
      throw error;
    }
  };

  getBrandsDetail = async (data) => {
    return await BrandModel.findOne(data);
  };

  updateSingleItemByFilter = async (data, updateData) => {
    try {
      const updateBrand = await BrandModel.findOneAndUpdate(
        data,
        {
          $set: updateData,
        },
        { new: true }
      );
      return updateBrand;
    } catch (error) {
      throw error;
    }
  };

  //pagination
  getAllItemsByFilter = async (data, query = {}) => {
    try {
      let page = query.page || 1;
      let limit = query.limit || 15;
      let skip = (page - 1) * limit;

      let field = "createdAt";
      let dir = "asc";
      if (query.sort) {
        [field, dir] = query.sort.split("_");
      }
      const itemFilter = await BrandModel.find(data)
        .skip(skip)
        .limit(limit)
        .sort({ [field]: dir });

      const total = await BrandModel.countDocuments(data);
      return {
        data: itemFilter,
        pagination: {
          current: page,
          limit: limit,
          skip: skip,
          total: total,
          No_Of_Pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  };

  transformBrandUpdateData = async (req, oldFile) => {
    try {
      let payload = req.body;
      if (req.file) {
        payload.logo = await cloudinarySvs.fileUpload(req.file.path, "/brand");
      } else {
        payload.logo = oldFile.logo;
      }

      if (payload.name) {
        payload.slug = slugify(payload.name, {
          remove: /[*+~.()'"!:@]/g,
          lower: true,
        });
      }
      (payload.updatedBy = req), loggedInUser._id;

      return payload;
    } catch (error) {
      throw error;
    }
  };
  searchBrandById = async (id) => {
    try {
      const search = await BrandModel.findById(id);
      return search;
    } catch (error) {
      throw error;
    }
  };

  //slug::
  searchBrandBySlug = async (slug) => {
    try {
      const search = await BrandModel.findOne({ slug });
      return search;
    } catch (error) {
      throw error;
    }
  };
  transformBrandCreateData = async (req, res) => {
    try {
      let payload = req.body;
     
      if (req.file) {
        payload.logo = await cloudinarySvs.fileUpload(req.file.path, "brand/");
      }
      payload.slug = slugify(payload.name, {
        remove: /[*+~.()'"!:@]/g,
        lower: true,
      });

      // Extract the _id from the logged-in user
      payload.createdBy = req.loggedInUser && req.loggedInUser._id ? req.loggedInUser._id : null;

      return payload;
    } catch (error) {
      throw error;
    }
  };
}
const brandSvs = new BrandServices();
module.exports = brandSvs;
