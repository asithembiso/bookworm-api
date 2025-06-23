import jwt from "jsonwebtoken";
import User from "../models/User.js";
import "dotenv/config";

/**
 * Middleware to protect routes by verifying JWT token and attaching user to request.
 */
const protectRoute = async(req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        if(!token) return res.status(401).json({message: "No authentication token, access denied"});

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.userId).select("-password");
        if(!user) return res.status(401).json({message: "Token is not valid"});

        req.user = user;
        next();
    } catch (error) {
        console.log("Authentication error ", error.message)
        return res.status(401).json({message: "Internal server error"})
    }
};

export default protectRoute;