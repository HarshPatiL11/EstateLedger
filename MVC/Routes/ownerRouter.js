import express from "express";
import {
  deleteProperty,
  registerProperty,
} from "../Controller/propertyController.js";
import { ownerMiddleware } from "../Middleware/AdminMiddleware.js";

const ownerRouter = express.Router();

// create property
ownerRouter.post("/add-property", ownerMiddleware, registerProperty);

// property delete
ownerRouter.delete("/delete/:id", ownerMiddleware, deleteProperty);

export default ownerRouter;
