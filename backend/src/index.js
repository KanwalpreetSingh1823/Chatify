import express from "express";
import dotenv from "dotenv";

import {connectDB} from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser"

dotenv.config();
const app = express();
// Creating the first route for authentication

app.use(express.json()) // it will allow to parse the json
app.use("/api/auth", authRoutes)

app.use(cookieParser()); // it will allow to parse the cookies

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT : ${PORT}`);
    connectDB();
})