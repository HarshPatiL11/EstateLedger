import express from 'express';
import { userMiddleware } from "../Middleware/userMiddleware.js";
import UserSchema from "../Model/userModel.js";
import {
  resetPasswordController,
  updatePasswordController,
  userUpdateController,
} from "../Controller/userController.js";
import { authMiddle } from '../Middleware/AuthMiddleware.js';

const userRouter = express.Router();


userRouter.put("/update-profile", authMiddle, userUpdateController);//working
userRouter.put("/update-password", authMiddle, updatePasswordController);//working
userRouter.put("/reset-password", authMiddle, resetPasswordController);//working


export default userRouter;