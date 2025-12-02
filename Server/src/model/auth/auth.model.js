// src/model/auth/auth.model.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, trim: true, minlength: 3, maxlength: 30 },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    phoneNumber: { type: String, unique: true, sparse: true },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
      required: true,
    },
    location: String,
    gender: String,
    dob: Date,
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "inactive",
    },
    password: String,
  },
  { timestamps: true }
);

// PREVENT OVERWRITE + WORKS WITH require()
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = UserModel;   // ← THIS IS THE KEY