import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import colors from "colors";
import connectDb from "./DB/db.js";
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

// listen
app.listen(PORT, () => {
  console.log(`Listening to port number ${PORT}`.blue.bgGreen.bold);
});

connectDb()