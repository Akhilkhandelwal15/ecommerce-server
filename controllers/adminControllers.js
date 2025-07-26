import { CONFIG } from "../config/globalAppConstants.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export const addUser = async(req, res)=>{
    try{
        const {role, firstname, lastname, email, password} = req.body;
        if(!role || !firstname || !email || !password){
            return res.status(400).json({success: false, message: 'Some fields are missing'});
        }

        if(!CONFIG.VALID_ROLES.includes(role)){
            return res.status(400).json({success: false, message: 'Invalid role provided'});
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(409).json({success: false, message: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            role
        });

        return res.status(200).json({success: true, message: "User created succesfully!"});
    }
    catch(error){
        console.log("error:", error);
        return res.status(500).json({success: false, message: "Internal Server Error"});
    }
}

export const fetchUser = async(req, res)=>{
    try{
        const users = await User.find().select('-password -resetToken -resetTokenExpiry');
        res.status(200).json({success: true, mesage:"Users fetched successfully!", users});
    }
    catch(error){
        console.log("error:", error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}