import UserSchema from "../Model/userModel.js";

export const adminMiddleware = async (req, res, next) => {
  try {
    if (req.userType !== "admin") {
      return res.status(401).send({
        success: false,
        message: "Only Admin Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Unauthorized Access",
      error,
    });
  }
};

export const ownerMiddleware = async (req, res, next) => {
  try {
    if (req.userType !== "admin" && req.userType !== "owner") {
      return res.status(401).send({
        success: false,
        message: "Only Owner or Admin Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Unauthorized Access",
      error,
    });
  }
};
