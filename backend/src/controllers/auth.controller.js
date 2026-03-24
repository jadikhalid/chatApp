import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    if (!email || !fullName || !password) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password should be min 6 characters long",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      fullName,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        message: "User created successfully. good for you !",
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        profilePic: newUser.profilePic,
        createdAt: newUser.createdAt,
      });
    } else {
      return res.status(400).json({
        message: "User not created",
      });
    }
  } catch (error) {
    console.log("Error in signUp controller :", error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: "Invalides credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      generateToken(user._id, res);
      return res.status(200).json({
        message: "User logged in successfully",
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
      });
    } else {
      return res.status(400).json({
        error: "Invalides credentials",
      });
    }
  } catch (error) {
    console.log("Error in signIn controller :", error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const signout = (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({
      message: "User signed out successfully",
    });
  } catch (error) {
    console.log("Error in signOut controller :", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
};
