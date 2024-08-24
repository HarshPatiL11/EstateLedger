import { comparePassword, hashPassword } from "../Helper/AuthHelper.js";
import UserModel from "../Model/userModel.js";

// Get user by token
export const getUserByToken = async (req, res) => {
  try {
    console.log("User ID from token:", req.userId);
    const user = await UserModel.findById(req.userId);
    if (!user) return res.status(404).send("User not found"); // Handle not found case
    res.status(200).json(user); // Return the user
  } catch (error) {
    console.error(`Error getting user by token: ${error}`);
    res
      .status(500)
      .send("Internal Server Error || Error in get user by token API");
  }
};

// Get user by ID
export const getUserByID = async (req, res) => {
  try {
    const { _id } = req.params;
    const user = await UserModel.findById(_id);
    if (user) return res.status(200).json(user);
    else return res.status(404).send("User not found");
  } catch (error) {
    console.error(`Error getting user by ID: ${error}`);
    res
      .status(500)
      .send("Internal Server Error || Error in get user by ID API");
  }
};

// Update user details
export const userUpdateController = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user)
      return res.status(404).send({
        success: false,
        message: "User not found",
      });

    const { name, lastName, phone } = req.body;

    if (name) user.name = name;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;

    await user.save();
    res.status(200).send({
      success: true,
      message: "User data updated successfully",
    });
  } catch (error) {
    console.error(`Error in API: ${error}`);
    res.status(500).send({
      status: "error",
      message: "Internal Server Error || Error in update API",
    });
  }
};

// Reset password
export const resetPasswordController = async (req, res) => {
  try {
    const { email, newPassword, answer } = req.body;
    if (!email || !newPassword || !answer) {
      return res
        .status(400)
        .send({ success: false, message: "Enter all details" });
    }
    const user = await UserModel.findOne({ email, frgtKey: answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    const hashedResetPass = await hashPassword(newPassword);
    user.password = hashedResetPass;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(`Error in API: ${error}`);
    res.status(500).send({
      status: "error",
      message: "Internal Server Error || Error in reset password API",
    });
  }
};

// Update password
export const updatePasswordController = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .send({ success: false, message: "Enter both password fields" });
    }

    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).send("Old password is incorrect");
    }

    if (oldPassword === newPassword) {
      return res
        .status(400)
        .send("New password cannot be the same as your old password");
    }

    const hashedUpdate = await hashPassword(newPassword);
    user.password = hashedUpdate;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(`Error in API: ${error}`);
    res.status(500).send({
      status: "error",
      message: "Internal Server Error || Error in update password API",
    });
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
