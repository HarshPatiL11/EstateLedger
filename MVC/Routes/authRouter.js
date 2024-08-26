import express from "express";
import {
  registerUser,
  userDelete,
  userLoginController,
  userLogoutController,
} from "../Controller/authController";
import { adminMiddleware } from "../Middleware/AdminMiddleware";

const authRouter = express.Router();
//Routers
authRouter.post("/user/register", registerUser);
authRouter.post("/user/login", userLoginController);
authRouter.post("/user/register", userLogoutController);
authRouter.delete("/admin/delete-account/:id", adminMiddleware, userDelete);
// export
export default authRouter;
