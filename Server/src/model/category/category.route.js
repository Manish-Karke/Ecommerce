const mongoose = require("mongoose");
const categoriesSchema = new mongoose.Schema({
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

  image:{
    public_id: String,
    url: String,
    optimizedUrl: String,

  },
  data:{
    type:String,
  },

  status:{
    type:String,
    required: true,
    enum: Object.values(Status),
    default:Status.INACTIVE
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
  })