import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {

    // Log cookies to inspect if jwt is present
    // console.log("Cookies:", req.cookies);
    
    // Get the token from user cookies
    const token = req.cookies.jwt;

    // If the token is not provided, then display status code with the error msg
    if (!token) {
      return res.status(401).json({ message: "Unauthorized Access- No Token Provided" });
    }

    // If there is token, then we can decode token to verify a valid token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // if the token is not decoded, then send status code with the msg
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized Access- Invalid Token" });
    }

    // If the token is valid then we send the userId to find the User.
    const user = await User.findById(decoded.userId).select("-password");

    // If there is no user found with that token (never used -> just to be safe adding check)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};