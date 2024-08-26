import express from "express";
import { userDelete } from "../Controller/authController.js";
import { adminMiddleware } from "../Middleware/AdminMiddleware.js";
import {
  deleteProperty,
  getAllProperties,
} from "../Controller/propertyController.js";
import {
  getAllUsers,
  getUserByID,
  updateUserTypeController,
  userUpdateController,
} from "../Controller/userController.js";

const adminRouter = express.Router();
//Routers

// get all props or user
adminRouter.get("users/get/all", adminMiddleware, getAllUsers);
adminRouter.get("users/get/:id", adminMiddleware, getUserByID);

adminRouter.get("property/get/all", adminMiddleware, getAllProperties);

// update props or user
adminRouter.put("users/update/:id", adminMiddleware, userUpdateController);
// adminRouter.put("property/update/:id", adminMiddleware, updateProperty);

// upgrade user
adminRouter.put(
  "users/update-userType/:id",
  adminMiddleware,
  updateUserTypeController
);

// delete prop or user
adminRouter.delete("/delete-account/:id", adminMiddleware, userDelete);
adminRouter.delete("/delete-property/:id", adminMiddleware, deleteProperty);

// export
export default adminRouter;
