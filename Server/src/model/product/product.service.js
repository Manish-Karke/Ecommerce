const { default: slugify } = require("slugify");
const ProductModel = require("./product.model");
const cloudinarySvs = require("../../ServiceBack/cloudinary.service");
const { generateRandomString } = require("../../utilities/helper");

class ProductServices {
  transformCreateProduct = async (req) => {
    try {
      let payload = req.body;

      //slug
      if (payload.name) {
        payload.slug = slugify(payload.name + "-" + generateRandomString(30), {
          remove: /[*+~.()'"!:@]/g,
          lower: true,
        });
      }

      let price = payload.price * 100;

      if (payload.discount) {
        payload.afterDiscount = price - price * (payload.discount / 100);
      }

      payload.price = price;

      if (
        !payload.categoryId ||
        payload.categoryId === null ||
        payload.categoryId === ""
      ) {
        payload.categoryId = null;
      }

      if (
        !payload.brandId ||
        payload.brandId === null ||
        payload.brandId === ""
      ) {
        payload.brandId = null;
      }

      if (!payload.seller || payload.seller === null || payload.seller === "") {
        payload.seller = req.loggedInUser._id;
      }

      payload.createdBy = req.loggedInUser._id;

      //images
      if (req.files) {
        payload.images = [];
        let beforeUpload = [];

        req.files.map((image) =>
          beforeUpload.push(cloudinarySvs.fileUpload(image.path, "Product/"))
        );

        const uploadImages = await Promise.allSettled(beforeUpload);

        if (uploadImages) {
          uploadImages.map((success) => {
            if (success.status === "fulfilled") {
              payload.images.push(success.value);
            }
          });
        }
      }

      return payload;
    } catch (error) {
      throw error;
    }
  };

  createProduct = async (data) => {
    try {
      const userDetail = new ProductModel(data);
      return await userDetail.save();
    } catch (error) {
      throw error;
    }
  };

  listAllProduct = async (data, query = {}) => {
    try {
      let current = query.page || 1;
      let limit = query.limit || 15;
      let skip = (current - 1) * limit;
      let field = "createdAt";
      let dir = "desc";

      const userDetail = await ProductModel.find(data)
        .skip(skip)
        .limit(limit)
        .sort({ [field]: dir })
        .populate("createdBy", ["username", "email", "gender", "status"]);

      const total = await ProductModel.countDocuments(data);
      return {
        data: userDetail,
        pagination: {
          page: current,
          limit: limit,
          skip: skip,
          total: total,
          No_of_pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  };
  getProductById = async (filter) => {
    try {
      const userDetail = await ProductModel.findById(filter);

      return userDetail;
    } catch (error) {
      throw error;
    }
  };

  updateProductById = async (data, filter) => {
    try {
      const updatedProduct = await ProductModel.findOneAndUpdate(
        data,
        {
          $set: filter,
        },
        { new: true }
      );
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  };
  deleteProductById = async (Data) => {
    try {
      const deleteProduct = await ProductModel.findByIdAndDelete(Data);
      return deleteProduct;
    } catch (error) {
      throw error;
    }
  };

  transformUpdateProductData = async (req, oldFile) => {
    try {
      let payload = req.body;

      if (!payload.name) {
        payload.name = oldFile.name;
      }

      if (!payload.description) {
        payload.description = oldFile.description;
      }

      if (!payload.isMenu) {
        payload.isMenu = oldFile.isMenu;
      }

      if (!payload.status) {
        payload.status = oldFile.status;
      }

      if (!payload.price) {
        payload.price = oldFile.price;
      }

      if (
        !payload.brandId ||
        payload.brandId === null ||
        payload.brandId === ""
      ) {
        if (oldFile.brandId === null) {
          payload.brandId ? (payload.brandId = payload.brandId) : null;
        } else {
          payload.categoryId = [...oldFile.categoryId];
        }
      }

      if (
        !payload.categoryId ||
        payload.categoryId === null ||
        payload.categoryId === ""
      ) {
        if (oldFile.categoryId === null) {
          payload.categoryId ? (payload.categoryId = payload.categoryId) : null;
        } else {
          payload.categoryId = [...oldFile.categoryId];
        }
      }

      if (!payload.order || payload.order === null || payload.order === "") {
        payload.order = oldFile.order;
      }

      if (!payload.stock || payload.stock === null || payload.stock === "") {
        payload.stock = oldFile.stock;
      }

      if (
        !payload.isFeatured ||
        payload.isFeatured === null ||
        payload.isFeatured === ""
      ) {
        payload.isFeatured = oldFile.isFeatured;
      }

      payload.price = payload.price * 100;

      if (payload.discount) {
        payload.afterDiscount =
          payload.price - (payload.price * payload.discount) / 100;
      }

      payload.images = [...oldFile.images];

      if (req.files) {
        let beforeUpload = [];

        req.files.map((image) => {
          beforeUpload.push(cloudinarySvs.fileUpload(image.path, "Product/"));
        });

        let UploadImages = await Promise.allSettled(beforeUpload);

        if (UploadImages) {
          UploadImages.map((succ) => {
            if (succ.status === "fulfilled") {
              payload.images.push(succ.value);
            }
          });
        }
      }

      payload.updatedBy = req.loggedInUser._id;

      return payload;
    } catch (error) {
      throw error;
    }
  };
}

const productSvc = new ProductServices();

module.exports = productSvc;
