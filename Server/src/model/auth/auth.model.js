import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  email: String, // String is shorthand for {type: String}
  phoneNumber: String,
  role: String,
  location: String,
  gender: String,
  dob: Date,
  status: {
    // Add this new field
    type: String,
    enum: ["active", "inactive", "suspended"], // Define possible statuses
    default: "inactive", // Default to 'inactive'
  },
  password: String,
});
const UserModel = mongoose.model("User", userSchema);
export default UserModel;
