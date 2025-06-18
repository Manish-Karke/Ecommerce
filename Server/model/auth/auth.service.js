import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./auth.model.js";

const saltRounds = 10;

export const registerUser = async (req, res) => {
  try {
    // Step 1: Check if email exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).send("Email already taken");

    // Step 2: Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Step 3: Create user
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).send("User registered");
  } catch (error) {
    return res.status(500).send("Something went wrong");
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Check email exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: "Email not found" });

    // Step 2: Validate password
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched)
      return res.status(401).send({ message: "Invalid password" });

    // Step 3: Generate JWT
    const token = jwt.sign(
      { email },
      "33ceecfc3c914cb6dee77a8c16d08211caf46cfb1aa0b9372f24e39fbaaa1fca31d1a7ae7938579f7ed157636babf812ac42468d431128f7f3098c51a5a4a69a"
    );

    return res.send({
      message: "Logged in successfully",
      user,
      isLoggedIn: true,
      token,
    });
  } catch (error) {
    return res.status(500).send("Login failed");
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.send(users);
  } catch (error) {
    return res.status(500).send("Error fetching users");
  }
};
