import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import colors from "colors";
import connectDb from "./DB/db.js";

// import routers from ../Routes
import authRouter from "./MVC/Routes/authRouter.js";
import adminRouter from "./MVC/Routes/adminRouter.js";
import ownerRouter from "./MVC/Routes/ownerRouter.js";
import userRouter from "./MVC/Routes/userRouter.js";
import propertyRouter from "./MVC/Routes/propertyRouter.js";

// Load environment variables
dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 8000; 

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// test server
app.get("/", (req, res) => {
  res.send(`<h1>hello port ${PORT}</h1>`);
});

// set routes
const router = express.Router();

router.use("/user", authRouter);
router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/owner", ownerRouter);
router.use("/property",propertyRouter)

app.use('/api/v1',router)


// listen
app.listen(PORT, () => {
  console.log(`Listening to port number ${PORT}`.blue.bgGreen.bold);
});

connectDb()