import UserSchema from "../Model/userModel.js";

export const userMiddleware = async (req, res, next) => {
  try {
    if (req.userId !== req.body.id) {
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

