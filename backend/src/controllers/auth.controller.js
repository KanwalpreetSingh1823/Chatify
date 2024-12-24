import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async(req, res) =>{
  // Destructuring all the required information from the body of the headers/ req
  const { fullName, email, password } = req.body;

  // Handling in try catch to avoid hanging up the application
  try {

    // First-Check that are all the fields provided by the user
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Second-Check that the password is atleast 6 characters ?
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // If all the above Checks passed then, find that if the user already exists in the database, to avoid data duplication and creation of multiple accounts using single email id.
    const user = await User.findOne({ email });

    // If the user is found, then return status code 400  and toast notification as user already exists.
    if (user) return res.status(400).json({ message: "Email already exists" });

    // Now after checking all the necessary steps above, then we get here and starts the creation of new user

    // First create the salt for hashing the password, so that hashed password gets stored in the database for user privacy.
    const salt = await bcrypt.genSalt(10);

    // Now using bycrypt, we will hash the password sent by user with the salt to create the hashed password.
    const hashedPassword = await bcrypt.hash(password, salt);

    // Now we will create new User with the fullName, email and the hashed password.
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    // Now when the new user gets created we do further steps
    if (newUser) {
      // generate jwt token here, so that when user chats and uses our application, he/she can send the jwt token everytime the request is made so as to know that the user is logged in and authenticated.
      generateToken(newUser._id, res);      // Generate token function 

      // Now saving the user to the database
      await newUser.save();

      // Sending the success msg
      res.status(201).json({
        _id : newUser._id,
        fullName : newUser.fullName,
        email : newUser.email,
        profilePic : newUser.profilePic
      })

    } else{
        res.status(400).json({
            message : "Invalid user data"
        })
    }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export const login = (req, res) =>{
    res.send("login route");
}

export const logout = (req, res) =>{
    res.send("logout route");
}