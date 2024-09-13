import express from "express";
import {
  deleteProperty,
  getInterestedUsersByPorpId,
  registerProperty,
  updateProperty,
} from "../Controller/propertyController.js";
import { ownerMiddleware } from "../Middleware/AdminMiddleware.js";
import { authMiddle } from "../Middleware/AuthMiddleware.js";
import formidable from "express-formidable";
import {
  getPropertiesByOwnerName,
  getPropertiesByOwnerToken,
} from "../Controller/ownerPropController.js";
import { getInterestedUserByID } from "../Controller/userController.js";
import { approveInterestedUser, getInterestedUsersByOwnerId } from "../Controller/interestedController.js";

const ownerRouter = express.Router();

// create property
ownerRouter.post(
  "/property/add-property",
  authMiddle,
  ownerMiddleware,
  formidable(),
  registerProperty
);
ownerRouter.get(
  "/property/get",
  authMiddle,
  ownerMiddleware,
  getPropertiesByOwnerToken
);

// get all users interestd in all porps owned by owner
ownerRouter.get(
  "/property/all/interested",
  authMiddle,
  ownerMiddleware,
  getInterestedUsersByOwnerId
);

// get all interested users a prop id
ownerRouter.get(
  "/property/:id/interested",
  authMiddle,
  ownerMiddleware,
  getInterestedUsersByPorpId
);

// get interersted user by id
ownerRouter.get(
  "/interested/user/:id",
  authMiddle,
  ownerMiddleware,
  getInterestedUserByID
);

// Aprpve user
ownerRouter.put(
  "/interested/user/:_id/approve", // Use _id in the route
  authMiddle,
  ownerMiddleware,
  approveInterestedUser
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
