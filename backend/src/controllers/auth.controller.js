import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
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
        message: "User created successfully",
      });
    } else {
      return res.status(500).json({
        error: "Something went wrong",
      });
    }
  } catch (error) {}
};

export const signin = (req, res) => {
  res.send("Signin Route");
};

export const signout = (req, res) => {
  res.send("Signout Route");
};
