import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();

// CORS configuration (should be placed before cookieParser)
app.use(cors({
    origin: 'http://localhost:5173',  // Allow requests from this origin (your React app)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
    credentials: true,  // Allow cookies (JWT tokens) to be sent along with requests
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
}));

// Body parser middleware to parse JSON in the request body
app.use(express.json());  // It will allow to parse the JSON body

// Cookie parser middleware (this should come after CORS)
app.use(cookieParser());  // It will allow to parse the cookies from requests

// Authentication routes
app.use("/api/auth", authRoutes);

// Message Routes
app.use("/api/message", messageRoutes);

// Start server and connect to the database
const PORT = process.env.PORT || 5001;  // Ensure you set a default port if it's undefined
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
    connectDB();  // Connect to the database when the server starts
});
