import express from "express";
import dotenv from "dotenv";
const app = express();

import {connectDB} from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();
// Creating the first route for authentication
app.use("/api/auth", authRoutes)

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`Server is running on PORT : ${PORT}`);
    connectDB();
})