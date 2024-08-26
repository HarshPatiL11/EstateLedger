import UserModel from "../Models/UserModel.js";

export const adminMiddleware = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.body.id);
    if (user.userType !== "admin") {
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
    const user = await UserModel.findById(req.body.id);
    if (user.userType !== "admin" || user.userType !== "owner") {
      return res.status(401).send({
        success: false,
        message: "Only owner or admin  Access",
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
