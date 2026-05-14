import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./routes/taskRoute.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGO_URL;

mongoose
.connect(MONGOURL)
.then(()=>{
    console.log("Database connected successfully");
    app.listen(PORT,()=>{
        console.log(`server is running on port : ${PORT}`);
    });
})
.catch((error)=>console.log(error));

app.use("/api/task",route);