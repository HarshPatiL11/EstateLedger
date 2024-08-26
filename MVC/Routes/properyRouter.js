import express from 'express'
import { deleteProperty, filterProperties, getAllProperties, getPropertyById, registerProperty } from '../Controller/propertyController';
import { ownerMiddleware } from "../Middleware/AdminMiddleware";

const propertyRouter =express.Router();

// create property
propertyRouter.post('/property/register',ownerMiddleware,registerProperty)

// property filter 
propertyRouter.post('/property/filter',filterProperties);

// property get 
propertyRouter.get('/property/all',getAllProperties)
propertyRouter.get("/property/:id", getPropertyById);

// property delete 
propertyRouter.delete('/property/delete/:id',ownerMiddleware,deleteProperty)

export default propertyRouter;