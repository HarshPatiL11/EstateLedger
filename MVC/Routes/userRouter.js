import express from 'express';
import { userMiddleware } from "../Middleware/userMiddleware.js";
import UserSchema from "../Model/userModel.js";
import {
  becomeOwnerController,
  getInterestedPropsByUserId,
  resetPasswordController,
  updatePasswordController,
  userUpdateController,
} from "../Controller/userController.js";
import { authMiddle } from '../Middleware/AuthMiddleware.js';

const userRouter = express.Router();
userRouter.get("/interested/properties",authMiddle,getInterestedPropsByUserId)
userRouter.put('/become-owner' , authMiddle , becomeOwnerController)
userRouter.put("/update-profile", authMiddle, userUpdateController);//working
userRouter.put("/update-password", authMiddle, updatePasswordController);//working

export default userRouter;