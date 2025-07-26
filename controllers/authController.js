import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEMail } from "../utils/sendEmail.js";

export const loginUser = async(req, res) =>{
    try{
        const {email, password, rememberMe} = req.body;
        const cookieMaxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000; // 7d or 1h in ms


        // Validate input
        if(!email || !password){
            return res.status(400).json({success: false, message: "Email and password are required"});
        }

        // Check if user exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({success: false, message:"Invalid credentials"});
        }

        const token =  jwt.sign(
            {id: user._id, email: user.email, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: rememberMe ? '7d' : '1h'},
        )

        res.cookie("token", token, {
            httpOnly : true,
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "strict", // Helps prevent CSRF attacks
            maxAge: cookieMaxAge
        });

        res.status(200).json({
            success: true, 
            message: "Login Successful", 
            user: {
                id: user._id, 
                firstname: user.firstname, 
                lastname: user.lastname, 
                email: user.email
            }
        });
    }
    catch(error){
        console.log("error", error);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
}

export const registerUser = async(req, res) =>{
    try{
        const {firstname, lastname, email, password} = req.body;
        if(!firstname || !email || !password){
            return res.status(400).json({success: false, message: "All fields are required"});
        }

        // check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({success: false, message: "User already exists"});
        }

        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const newUser = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword
        });

        return res.status(201).json({success:true, message: "User registered successfully", user: {id: newUser._id, firstname, lastname, email}});
    }
    catch(error){
        console.log("error", error);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
}

export const getCurrentUser = async(req, res)=>{
    try{
        const userId = req.user.id; // from verifyToken middleware
        const user = await User.findById(userId).select('-password'); // Exclude password from response
        console.log("user", userId);
        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }

        res.status(200).json({success: true, message:"User retrieved successfully", user});
    }
    catch(error){
        console.log("error", error);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
}

export const logoutUser = async(req, res)=>{
    try{
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(200).json({success: true, message: "User Logged out successfully!"});
    }
    catch(error){
        console.log("error:", error);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
}

export const verifyEmail = async(req, res)=>{
    try{
        const {email} = req.body;
        if(!email){
            return res.status(400).json({success: false, message: "Email is required"});
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({success: false, message:"User not found"});
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

        user.resetToken = hashedToken; // save hashed token in db
        user.resetTokenExpiry = Date.now() + 15*60*1000;
        await user.save();

        const resetLink = process.env.CORS_ORIGIN + '/reset-password?token='+ rawToken; // send raw token in link

        const html = `
            <h2>Reset Your Password</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>This token is only valid for 15 minutes. </p>
        `;

        await sendEMail(user.email, 'Password Reset', html);

        return res.status(200).json({success: true, message:"Link to reset password has been sent to your email successfully!"});
    }
    catch(error){
        console.log("error:", error);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
}

export const resetPassword = async(req, res) =>{
    try{
        const {password, token} = req.body;

        if(!password || !token){
            return res.status(400).json({success: false, message: "Password and token are required"});
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetToken: hashedToken,
            resetTokenExpiry: {$gt: Date.now()}
        });
        
        if(!user){
            return res.status(400).json({success: false, message:"Invalid or expired token"});
        }

        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        res.status(200).json({success: true, message: "Password reset successful"});
    }
    catch(error){
        console.log("error:", error);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
}