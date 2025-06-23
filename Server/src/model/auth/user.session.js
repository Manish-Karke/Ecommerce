const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    actualTokem: {
      actual: String,
      masked: String,
    },
    RefreshToken: {
      actual: String,
      masked: String,
    },
    SessionData: String,
  },
  {
    timestamps: true,
    autoCreate: true,
    autoCreate: true,
  }
);

const sessionModel = new mongoose.model("SessionData", sessionSchema);

module.exports = sessionModel;
