import express from 'express';
import { userMiddleware } from '../Middleware/userMiddleware';
import UserSchema from '../Model/userModel'
import { resetPasswordController, updatePasswordController, userUpdateController } from '../Controller/userController';

const userRouter = express.Router();

userRouter.put("/update-profile", userMiddleware, userUpdateController);
userRouter.put("/update-password", userMiddleware, updatePasswordController);
userRouter.put("/reset-password", userMiddleware, resetPasswordController);

export default userRouter;