import express from "express";
import {
  registerUser,
  userDelete,
  userLoginController,
  userLogoutController,
} from "../Controller/authController.js";
import { userMiddleware } from "../Middleware/userMiddleware.js";
import { authMiddle } from "../Middleware/AuthMiddleware.js";

const authRouter = express.Router();
//Routers
authRouter.post("/register", registerUser);//working
authRouter.post("/login", userLoginController);//working
authRouter.post("/logout", authMiddle, userLogoutController);//working
authRouter.delete("/delete-profile", authMiddle, userDelete);//working

// export
export default authRouter;
