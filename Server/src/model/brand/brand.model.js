const mongoose = require("mongoose");
const { Status } = require("../../config/constant");

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 50,
      unique: true,
    },

    slug: {
      type: String,
      require: true,
      unique: true,
    },

    logo: {
      public_id: String,
      url: String,
      optimizedUrl: String,
    },

    data: {
      type: String,
    },

    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.INACTIVE,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
   },
  {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
  }
);

const BrandModel = mongoose.model("Brand", BrandSchema);
module.exports = BrandModel;
