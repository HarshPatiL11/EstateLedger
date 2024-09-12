import express from "express";
import { userDelete, userDeleteUsingId } from "../Controller/authController.js";
import { adminMiddleware } from "../Middleware/AdminMiddleware.js";
import formidable from "express-formidable";

import {
  approveProperty,
  deleteProperty,
  getAllProperties,
  updateProperty,
} from "../Controller/propertyController.js";
import {
  approveUser,
  getAllUsers,
  getUserByID,
  updateUserTypeController,
  updateUserUsingID,
  userUpdateController,
} from "../Controller/userController.js";
import { authMiddle } from "../Middleware/AuthMiddleware.js";

const adminRouter = express.Router();
//Routers

// admin panel  user routes 
// admin panel get user
adminRouter.get("/users/get/all", authMiddle, adminMiddleware, getAllUsers); //working

adminRouter.get(
  "/users/get/:id",
  authMiddle,
  adminMiddleware,
  getUserByID
);                   //working          

//admin panel update  user details
adminRouter.put(
  "/users/update/:id",
  authMiddle,
  adminMiddleware,
  updateUserUsingID
);            //working



// upgrade userType
adminRouter.put(
  "/users/update-userType/:id",
  authMiddle,
  adminMiddleware,
  updateUserTypeController
);            //working

adminRouter.put("/users/approve/:id", authMiddle, adminMiddleware, approveUser);            

// delete user account
adminRouter.delete(
  "/users/delete-account/:id",
  authMiddle,
  adminMiddleware,
  userDeleteUsingId
);   //working

// admin panel  Property routes 

adminRouter.get(
  "/property/get/all",
  authMiddle,
  adminMiddleware,
  getAllProperties
);                                

// adminRouter.put("property/update/:id", adminMiddleware, updateProperty);
// Verify Property
adminRouter.put(
  "/property/approve/:id",
  authMiddle,
  adminMiddleware,
  approveProperty
);

// update property
adminRouter.put(
  "/property/update/:id",
  authMiddle,
  adminMiddleware,
  formidable(),
  updateProperty
);

// Delete Property usin Id
adminRouter.delete(
  "/delete-property/:id",
  authMiddle,
  adminMiddleware,
  deleteProperty
);

// export
export default adminRouter;
