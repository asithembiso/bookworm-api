import express from "express";
import User from "../models/User.js"
import jwt from "jsonwebtoken";

const router = express.Router();

/**
 * Generates a JWT token for a given user ID.
 */
const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "15d"})
};

/**
 * Registers a new user, validates input, checks for duplicates, and returns a JWT token.
 */
router.post("/register", async (req, res) => {
    try {
        const {email, username, password} = req.body;

        if(!username || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password should be at least 6 charecters long"});
        }
        if(username.length < 3){
            return res.status(400).json({message: "Username should be at least 3 charecters long"});
        }

        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({message: "Email already exist"});
        }
        const existingUsername = await User.findOne({username});
        if(existingUsername){
            return res.status(400).json({message: "Username already exist"});
        }

        const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=Luis`;

        const user = new User({
            email,
            username,
            password,
            profileImage,
        });

        await user.save();

        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.log("Error in register route", error)
        res.status(500).json({message: "Internal server error"})
    }
})

/**
 * Logs in a user by validating credentials and returns a JWT token.
 */
router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) return res.status(400).json({message: "All fields required"});

        const user = await User.findOne({email})
        if(!user) return res.status(400).json({message: "Invalid credentials"});
        
        const isPasswordCorrect = await user.comparePassword(password)
        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"});

        const token = generateToken(user._id);
        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.log("Error in login route", error)
        res.status(500).json({message: "Internal server error"})
    }
})

export default router;
