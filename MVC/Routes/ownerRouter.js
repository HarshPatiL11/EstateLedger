import express from "express";
import {
  deleteProperty,
  registerProperty,
  updateProperty,
} from "../Controller/propertyController.js";
import { ownerMiddleware } from "../Middleware/AdminMiddleware.js";

const ownerRouter = express.Router();

// create property
ownerRouter.post("/add-property", ownerMiddleware, registerProperty);

// update property
ownerRouter.put('/property/update/:id',ownerMiddleware,updateProperty)

// property delete
ownerRouter.delete("/property/delete/:id", ownerMiddleware, deleteProperty);

export default ownerRouter;
