import express from "express";
import {
  deleteProperty,
  registerProperty,
} from "../Controller/propertyController";
import { ownerMiddleware } from "../Middleware/AdminMiddleware";

const ownerRouter = express.Router();

// create property
propertyRouter.post("/add-property", ownerMiddleware, registerProperty);

// property delete
ownerRouter.delete("/delete/:id", ownerMiddleware, deleteProperty);

export default ownerRouter;
