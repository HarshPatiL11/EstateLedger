import { comparePassword, hashPassword } from "../Helper/AuthHelper.js";
import UserSchema from "../Model/userModel.js";


// get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserSchema.find({});
    if (users.length === 0) return res.status(404).send("No users found");
      users.forEach((user) => (user.password = undefined));
    res.status(200).json(users); // Return the users
  } catch (error) {
    console.error(`Error getting all users: ${error}`);
    res.status(500).send("Internal Server Error || Error in get all users API");
  }
};


// Get user by token
export const getUserByToken = async (req, res) => {
  try {
    console.log("User ID from token:", req.userId);
    const user = await UserSchema.findById(req.userId);
    if (!user) return res.status(404).send("User not found"); 
    res.status(200).json(user); 
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
    const { id } = req.params;

     if (!id) {
       return res.status(400).send({
         success: false,
         message: "User ID is required",
       });
     }

     // Validate if the user is an admin
     if (req.userType !== "admin") {
       return res.status(403).send({
         success: false,
         message: "Forbidden: Only admins can access users using ID",
       });
     }

    const user = await UserSchema.findById(id);
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
    const user = await UserSchema.findById(req.userId);
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

//update user using id (admin only)
export const updateUserUsingID = async(req,res)=>{
  try {
    const { id } = req.params;

    // Check if the user ID in the request parameters is valid
    if (!id) {
      return res.status(400).send({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await UserSchema.findById(id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Check if the user making the request is an admin or the same user
    if (req.userType !== "admin" && req.userId !== id) {
      return res.status(403).send({
        success: false,
        message:
          "Forbidden: You can only update your own details or be an admin",
      });
    }

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
      success: false,
      message: "Internal Server Error || Error in update API",
    });
  }
}


// update userType(Admin only)
export const updateUserTypeController = async (req, res) => {
  try {
    const { id } = req.params;
    const { userType } = req.body;
    const validUserTypes = ["client", "owner", "admin"];
    if (!validUserTypes.includes(userType)) {
      return res.status(400).send({
        success: false,
        message:
          "Invalid userType. Allowed values are 'client', 'owner', or 'admin'.",
      });
    }

    const user = await UserSchema.findById(id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    if (user.userType === userType){
       return res.status(404).send({
         success: false,
         message: `User already a ${userType} `,
       });
    }
      // update userType
      user.userType = userType;
    await user.save();

    res.status(200).send({
      success: true,
      message: "User type updated successfully",
      user,
    });
  } catch (error) {
    console.error(`Error updating userType: ${error}`);
    res.status(500).send({
      status: "error",
      message: "Internal Server Error || Error in update userType API",
    });
  }
};

// Reset password
export const resetPasswordController = async (req, res) => {
  try {
    const { email, newPassword, frgtKey } = req.body;
    if (!email || !newPassword || !frgtKey) {
      return res
        .status(400)
        .send({ success: false, message: "Enter all details" });
    }
    const user = await UserSchema.findOne({ email, frgtKey });
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
    const user = await UserSchema.findById(req.userId);
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
