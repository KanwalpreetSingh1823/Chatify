import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async(req, res) =>{
  // Destructuring all the required information from the body of the headers/ req
  const { fullName, email, password } = req.body;

  // Handling in try catch to avoid hanging up the application
  try {

    // First-Check that are all the fields provided by the user ?
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Second-Check that the password is atleast 6 characters ?
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // If all the above Checks passed then, find that if the user already exists in the database?, to avoid data duplication and creation of multiple accounts using single email id.
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

export const login = async (req, res) =>{

    // Destructuring all the required information from the body of the headers/req
    const { email, password } = req.body;

  try {

    // find that if the user already exists in the database.
    const user = await User.findOne({ email });

    // if no user found, then send status code and msg with invalid credentials.
    if (!user) {                                                        
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // if user existed, we will now check that, is the password correct ?
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // if the password is incorrect we will send the status code with the message
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // so now the passsword is correct, we generate the token 
    generateToken(user._id, res);

    // send back the data to client in json
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const logout = async (req, res) =>{
    // in logout we just need to is clear out the cookies
    try {
        res.cookie("jwt", "", { maxAge: 0 });   // empty string to clear the cookie
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}