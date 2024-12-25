import express from "express";
import {signup, login, logout, updateProfile, checkAuth} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/update-profile",protectRoute, updateProfile);
// this route is protected, which means if the user is logged in / authenticated --> then only he/she can update the profile.

router.get("/check", protectRoute, checkAuth); // Sends back the authenticated user to client

export default router;