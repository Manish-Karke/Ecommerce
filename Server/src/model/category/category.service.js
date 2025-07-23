const cloudinarySvs = require("../../ServiceBack/cloudinary.service");
const slugify = require("slugify");
const categoryModel = require("./category.model");
class categoryServices {
  tranforCreateBrandData = async (req) => {
    let payload = req.body;
    if (req.file) {
      payload.image = await cloudinarySvs.fileUpload(
        req.file.path,
        "category/"
      );
    }

    payload.slug = slugify(payload.name, {
      remove: /[*+~.()'"!:@]/g,
      lower: true,
    });

    if (
      payload.parentId === "null" ||
      !payload.parentId ||
      payload.parentId === ""
    ) {
      payload.parentId = null;
    }
    if (
      payload.brandId === "null" ||
      !payload.brandId ||
      payload.brandId === ""
    ) {
      payload.brandId = null;
    }

    payload.createdBy = req.loggedInUser?._id;
    return payload;
  };

  createCategory = async (data) => {
    try {
      const category = new categoryModel(data);

      return await category.save();
    } catch (error) {
      throw error;
    }
  };

  getAllCategory = async (data, query = {}) => {
    try {
      let page = query.page || 1;
      let limit = query.limit || 15;
      let skip = (page - 1) * limit;
      let field = "createdAt";
      let dir = "asc";
      if (query.sort) {
        [field, dir] = query.sort.split("_");
      }
      const itemFilter = await categoryModel
        .find(data)
        .skip(skip)
        .limit(limit)
        .sort({ [field]: dir });

      const total = await categoryModel.countDocuments(data);
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
}
const categorySvs = new categoryServices();
module.exports = categorySvs;
