import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validateAuth } from "../middleware/validation.js";

const router = Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Sign Up
router.post("/signup", validateAuth, async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      authProvider: "custom",
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        authProvider: user.authProvider,
        isEmailVerified: user.isEmailVerified,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

// Sign In
router.post("/signin", validateAuth, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Signed in successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        authProvider: user.authProvider,
        isEmailVerified: user.isEmailVerified,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

export default router;
