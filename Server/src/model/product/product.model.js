// name, images, [brandId], [CategoryId], isFeatured, isMenu, status, createdBy, updatedBy, description, price, discount, afterDiscout, order, cart,

const mongoose = require("mongoose");
const { Status } = require("../../config/constant");
const { required } = require("joi");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      min: 3,
      max: 100,
      required: true,
    },

    slug: {
      type: String,
      default: null,
      unique: true,
    },

    description: {
      type: String,
      default: null,
    },

    images: [
      {
        publicId: String,
        url: String,
        optimizedUrl: String,
      },
    ],

    isFeature: {
      type: Boolean,
      default: false,
      required: true,
    },

    isMenu: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.INACTIVE,
    },

    price: {
      type: Number,
      default: 0,
      min: 100,
      required: true,
    },

    discount: {
      type: Number,
      min: 0,
      max: 90,
      default: 0,
    },

    afterDiscount: {
      type: Number,
      default: 0,
    },

    order: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },

    Admin: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },

    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },

    brandId: 
      {
        type: mongoose.Types.ObjectId,
        ref: "Brand",
        default: null,
      },
    

    categoryId: 
      {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        default: null,
      },
    
  },
  {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
  }
);

const ProductModel = mongoose.model("Product", ProductSchema);
module.exports = ProductModel;
