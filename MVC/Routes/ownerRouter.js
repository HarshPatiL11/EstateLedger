import express from "express";
import {
  deleteProperty,
  registerProperty,
  updateProperty,
} from "../Controller/propertyController.js";
import { ownerMiddleware } from "../Middleware/AdminMiddleware.js";
import { authMiddle } from "../Middleware/AuthMiddleware.js";
import formidable from "express-formidable";

const ownerRouter = express.Router();

// create property
ownerRouter.post(
  "/property/add-property",
  authMiddle,
  ownerMiddleware,
  formidable(),
  registerProperty
);

// update property
ownerRouter.put(
  "/property/update/:id",
  authMiddle,
  ownerMiddleware,
  formidable(),
  updateProperty
);

// property delete
ownerRouter.delete(
  "/property/delete/:id",
  authMiddle,
  ownerMiddleware,
  deleteProperty
);

export default ownerRouter;
