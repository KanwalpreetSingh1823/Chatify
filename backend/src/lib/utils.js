import jwt from "jsonwebtoken";

export const generateToken = (userId, res) =>{
    // Generating a token which expires in 7 days using the payload from -> newUser _id
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn : "7d"        // after 7 days, user just have to login once again
    })

    // Sending it to user as a cookie
    res.cookie("jwt", token, {
        maxAge : 7 * 24 * 60 * 60 * 1000, // MS
        httpOnly : true, // Prevent XSS attacks -> cross-site scripting attacks
        sameSite : "strict", //CSRF attacks cross-site request forgery attacks
        secure : process.env.NODE_ENV !== "development"     // determines if the req is https or http
    })

    return token;
}