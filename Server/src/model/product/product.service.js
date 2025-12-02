// services/product.service.js
const { default: slugify } = require("slugify");
const ProductModel = require("./product.model");
const cloudinarySvs = require("../../ServiceBack/cloudinary.service");
const { generateRandomString } = require("../../utilities/helper");

class ProductService {
  // Transform data when creating a product
  transformCreateProduct = async (req) => {
    let payload = { ...req.body };

    // Generate slug
    if (payload.name) {
      payload.slug =
        slugify(payload.name, { lower: true }) + "-" + generateRandomString(8);
    }

    // Convert price to paisa (cents)
    payload.price = Math.round(payload.price * 100);

    // Calculate discounted price
    if (payload.discount > 0) {
      payload.afterDiscount =
        payload.price - (payload.price * payload.discount) / 100;
    }

    // Set defaults
    payload.categoryId = payload.categoryId || null;
    payload.brandId = payload.brandId || null;
    payload.seller = payload.seller || req.loggedInUser._id;
    payload.createdBy = req.loggedInUser._id;

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      payload.images = [];
      const uploadPromises = req.files.map((file) =>
        cloudinarySvs.fileUpload(file.path, "products")
      );

      const results = await Promise.allSettled(uploadPromises);
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          payload.images.push(result.value); // { public_id, secure_url }
        }
      });
    }

    return payload;
  };

  createProduct = async (data) => {
    const product = new ProductModel(data);
    return await product.save();
  };

  // MAIN FILTERING FUNCTION (Used by frontend)
  listAllProduct = async (filter = {}, query = {}) => {
    try {
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 12;
      const skip = (page - 1) * limit;

      // Build dynamic filter
      let dbFilter = { status: "active" }; // Only active products

      // Text search
      if (query.search) {
        dbFilter.$or = [
          { name: new RegExp(query.search, "i") },
          { description: new RegExp(query.search, "i") },
        ];
      }

      // Category filter
      if (query.categoryId) {
        dbFilter.categoryId = query.categoryId;
      }

      // Brand filter (supports comma-separated: "brand1,brand2")
      if (query.brandId) {
        const brandIds = query.brandId.split(",").filter(Boolean);
        if (brandIds.length > 0) {
          dbFilter.brandId = { $in: brandIds };
        }
      }

      // Price range
      if (query.minPrice || query.maxPrice) {
        dbFilter.price = {};
        if (query.minPrice) dbFilter.price.$gte = +query.minPrice * 100;
        if (query.maxPrice) dbFilter.price.$lte = +query.maxPrice * 100;
      }

      // Sorting
      let sort = { createdAt: -1 };
      if (query.sortBy) {
        switch (query.sortBy) {
          case "price_low":
            sort = { price: 1 };
            break;
          case "price_high":
            sort = { price: -1 };
            break;
          case "newest":
            sort = { createdAt: -1 };
            break;
          case "discount":
            sort = { discount: -1 };
            break;
        }
      }

      const products = await ProductModel.find(dbFilter)
        .populate("categoryId", "name slug")
        .populate("brandId", "name logo slug")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(); // Faster!

      const total = await ProductModel.countDocuments(dbFilter);

      // Convert price back to rupees
      const formattedProducts = products.map((p) => ({
        ...p,
        price: p.price / 100,
        afterDiscount: p.afterDiscount ? p.afterDiscount / 100 : undefined,
      }));

      return {
        data: formattedProducts,
        pagination: {
          current: page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  };

  getProductById = async (id) => {
    const product = await ProductModel.findById(id)
      .populate("categoryId", "name")
      .populate("brandId", "name logo")
      // .populate("seller", "name email")
      .lean();

    if (!product) return null;

    return {
      ...product,
      price: product.price / 100,
      afterDiscount: product.afterDiscount
        ? product.afterDiscount / 100
        : undefined,
    };
  };

  // Fixed update logic
  transformUpdateProductData = async (req, oldProduct) => {
    let payload = { ...req.body };

    // Keep old values if not provided
    payload.name = payload.name || oldProduct.name;
    payload.description = payload.description || oldProduct.description;
    payload.status = payload.status || oldProduct.status;
    payload.price = payload.price
      ? Math.round(payload.price * 100)
      : oldProduct.price;
    payload.stock = payload.stock ?? oldProduct.stock;
    payload.isFeatured = payload.isFeatured ?? oldProduct.isFeatured;
    payload.categoryId = payload.categoryId || oldProduct.categoryId;
    payload.brandId = payload.brandId || oldProduct.brandId;

    // Recalculate discount
    if (payload.discount >= 0) {
      payload.afterDiscount =
        payload.price - (payload.price * payload.discount) / 100;
    }

    // Keep existing images
    payload.images = oldProduct.images || [];

    // Add new images
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinarySvs.fileUpload(file.path, "products")
      );
      const results = await Promise.allSettled(uploadPromises);
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          payload.images.push(result.value);
        }
      });
    }

    payload.updatedBy = req.loggedInUser._id;

    return payload;
  };

  updateProductById = async (id, data) => {
    return await ProductModel.findByIdAndUpdate(id, data, { new: true })
      .populate("categoryId", "name")
      .populate("brandId", "name");
  };

  deleteProductById = async (id) => {
    return await ProductModel.findByIdAndDelete(id);
  };
}

const productSvc = new ProductService();
module.exports = productSvc;
