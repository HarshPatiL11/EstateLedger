import UserModel from "../Models/UserModel.js";

// Middleware to confirm the user's identity
export const confirmUserIdentity = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (user._id.toString() !== req.body.id) {
      return res.status(403).send({
        success: false,
        message: "You are not authorized to perform this action",
      });
    }

    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    console.error(`Error confirming user identity: ${error}`);
    res.status(500).send({
      status: "error",
      message: "Internal Server Error || Error in confirming user identity",
      error,
    });
  }
};
