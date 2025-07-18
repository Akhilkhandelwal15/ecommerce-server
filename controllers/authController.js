import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const loginUser = async(req, res) =>{
    try{
        const {email, password} = req.body;

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
            {id: user._id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: '1h'},
        )

        res.status(200).json({
            success: true, 
            mesagae: "Login Successful", 
            user: {
                id: user._id, 
                firstname: user.firstname, 
                lastname: user.lastname, 
                email: user.email
            }, 
            token
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
        hashedPassword = await bcrypt.hash(password, salt);

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