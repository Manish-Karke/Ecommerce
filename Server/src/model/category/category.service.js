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
}
const categorySvs = new categoryServices();
module.exports = categorySvs;
