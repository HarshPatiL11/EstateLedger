import { comparePassword, hashPassword } from "../Helper/AuthHelper.js";
import UserSchema from "../Model/userModel.js";
import Property from "../Model/PropertyModel.js";
import InterestPropsModel from "../Model/InterestPropsModel.js";

// get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const { userType } = req.query; // Extract userType from query parameters

    // Build the query filter
    const filter = {};
    if (userType && userType !== "all") {
      filter.userType = userType; // Add filter for userType
    }

    const users = await UserSchema.find(filter);

    if (users.length === 0) return res.status(404).send("No users found");

    // Remove sensitive data
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

// Interested User Controller (owner admin)
export const getInterestedUserByID = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        success: false,
        message: "User ID is required",
      });
    }

    // Validate if the user is an admin
   if (req.userType !== "admin" && req.userType !== "owner") {
     return res.status(403).send({
       success: false,
       message: "Forbidden: Only admins or owners",
     });
   }

    const user = await UserSchema.findById(id).select("name phone");
    if (user) return res.status(200).json(user);
    else
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
  } catch (error) {
    console.error(`Error getting user by ID: ${error}`);
    res.status(500).send({ success: false, message: "Internal Server Error || Error in get user by ID API" });
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

    const { name, phone, frgtKey } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;
      if (frgtKey) user.frgtKey = frgtKey;
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


export const becomeOwnerController = async (req, res) => {
  try {
    const user = await UserSchema.findById(req.userId);

    // Check if user exists
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is already an owner or admin
    if (user.userType === "owner" || user.userType === "admin") {
      return res.status(403).send({
        success: false,
        message: "Only clients can become owners",
      });
    }

    // Change userType to owner
    user.userType = "owner";
    await user.save();

    res.status(200).send({
      success: true,
      message: "User type changed to owner successfully",
      user,
    });
  } catch (error) {
    console.error(`Error in becomeOwnerController: ${error}`);
    res.status(500).send({
      success: false,
      message: "Internal Server Error || Error in become owner API",
      error,
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

    const { name, phone } = req.body;

    if (name) user.name = name;
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

// get all the props interested by a user
export const getInterestedPropsByUserId = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from the authenticated request
    console.log(`Received userId: ${userId}`); // Log the received userId for debugging

    // Query the database for interested properties
    const interestedList = await InterestPropsModel.find({ userId })
      .populate("propertyId", "project") // Only populate the 'project' field from propertyId
      .exec();

    console.log(`Interested List: ${JSON.stringify(interestedList)}`); // Log the result

    if (!interestedList.length) {
      console.warn(`No interested properties found for userId: ${userId}`); // Log the warning
      return res
        .status(404)
        .json({ message: "No interested properties found" });
    }

    // Attach additional details to each interest
    const interestedProjects = interestedList.map((item) => ({
      projectName: item.propertyId.project,
      interestedDate: item.createdAt, // Include the date when the user expressed interest
      isApprove: item.isApprove, // Include the approval status
    }));

    res.json({ interestedProjects });
  } catch (error) {
    console.error("Server error:", error); // Log detailed error
    res.status(500).json({ message: "Server error" });
  }
};

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


export const resetPasswordController = async (req, res) => {
    console.log("Reset Password Controller Hit");

  try {
    const { email, newPassword, frgtKey } = req.body;
    console.log("Reset Password Controller Hit now trying");


    if (!email || !newPassword || !frgtKey) {
      return res.status(400).send({
        success: false,
        message: "All fields are required.",
      });
    }

    const user = await UserSchema.findOne({ email, frgtKey });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid reset key or email.",
      });
    }

    const hashedResetPass = await hashPassword(newPassword);
    user.password = hashedResetPass;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
     console.error(`Error in API: ${error}`);
     res.status(500).send({
       success: false,
       message: "Internal Server Error || Error in Reset passWord API",
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

export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserSchema.findById(id); // Use the User model to find the user

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (user.userType !== "owner") {
      return res
        .status(400)
        .json({ success: false, message: "User is not an owner." });
    }

    if (user.approved) {
      return res
        .status(400)
        .json({ success: false, message: "User is already verified." });
    }

    user.approved = true;
    await user.save();

    res.json({ success: true, message: "Owner approved successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};
