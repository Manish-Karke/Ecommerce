import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, unique: true, sparse: true },
    phoneNumber: { type: String, unique: true, sparse: true },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
    location: String,
    gender: String,
    dob: Date,
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "inactive", // users need activation (via email or admin)
    },
    password: String,
  },
  {
    timestamps: true, // gives you createdAt & updatedAt automatically
  }
);

// THIS IS THE MOST IMPORTANT LINE
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
