import jwt from "jsonwebtoken";
import UserModel from "../Model/userModel.js";

import { comparePassword, hashPassword } from "../Helper/AuthHelper.js";

const JWT_SECRET = process.env.JWT_SECRET;
console.log("JWT_SECRET:", JWT_SECRET);

// Add user9
export const registerUser = async (req, res) => {
  try {
    const { name, lastName, email, password, phone, frgtKey } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).send("Enter your name");
    }
    if (!lastName) {
      return res.status(400).send("Enter your last name");
    }
    if (!email) {
      return res.status(400).send("Enter your email ID");
    }
    if (!password) {
      return res.status(400).send("Enter your password");
    }
    if (!phone) {
      return res.status(400).send("Enter your phone number");
    }
    if (!frgtKey) {
      return res.status(400).send("Set a forget password key");
    }

    // Check if user exists
    const chkExisting = await UserModel.findOne({ email });
    if (chkExisting) {
      return res.status(400).send("Email already registered");
    }

    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await UserModel.create({
      name,
      lastName,
      email,
      password: hashedPassword,
      phone,
      frgtKey,
    });

    // Generate token (optional, depending on your use case)
    // const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "1h" });

    // Send response
    return res.status(201).send({
      status: "success",
      message: "User registered successfully",
      user: newUser,
      // token,
    });
  } catch (error) {
    console.log(`Error in API: ${error}`);
    return res.status(500).send("Internal Server Error");
  }
};

// Delete user
export const userDelete = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (user) {
      await user.deleteOne();
      return res.status(200).send({
        success: true,
        message: "User deleted successfully",
      });
    } else {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error(`Error in API: ${error}`);
    res.status(500).send({
      status: "error",
      message: "Internal Server Error || Error in delete API",
    });
  }
};


// User login controller
export const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if password matches
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    // Hide password from response
    user.password = undefined;

    res.status(200).send({
      status: "success",
      message: "User logged in successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(`Error in API: ${error}`);
    res.status(500).send("Internal Server Error");
  }
};

// User logout controller
export const userLogoutController = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message:
        "User logged out successfully. Please clear your token on the client side.",
    });
  } catch (error) {
    console.log(`Error in API: ${error}`);
    res.status(500).send({
      status: "error",
      message: "Internal Server Error || Error in Logout API",
    });
  }
};
