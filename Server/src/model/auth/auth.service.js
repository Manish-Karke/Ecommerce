import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "./auth.model.js";
import { appConfig } from "../../config/config.config.js";

const saltRounds = 10;

export const registerUser = async (req, res) => {
  try {
    // Step 1: Check if email exists
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).json("Email already taken");

    // Step 2: Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Step 3: Create user
    const newUser = new UserModel({
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();
    return res.json({
      message: "registered in successfully",
      data: newUser,
      isLoggedIn: true,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Registraion failed. Please try again later." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Compare password with hashed password from DB
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if (user.status === "inactive") {
      user.status = "active"; // Change status to active
      await user.save(); // Save the updated user
      // Optionally, you might want to send a "Welcome!" email here
    }
    // If status is 'suspended' or other restricted states, you can prevent login:
    if (user.status === "suspended") {
      return res
        .status(403)
        .json({ message: "Your account has been suspended." });
    }
    // JWT
    const token = jwt.sign(
      { email: user.email, id: user._id },
      `${appConfig.jwtSecret}`,
      {
        expiresIn: "1h",
      }
    );

    return res.json({
      message: "Logged in successfully",
      user,
      isLoggedIn: true,
      token,
      status: user.status,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Login failed. Please try again later." });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    return res.send(users);
  } catch (error) {
    return res.status(500).send("Error fetching users");
  }
};
