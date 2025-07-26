import mongoose from 'mongoose';
import { CONFIG } from '../config/globalAppConstants.js';

const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastname: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    resetToken: {
        type: String
    },
    resetTokenExpiry: {
        type: Date
    },
    role:{
        type: String,
        enum: CONFIG.VALID_ROLES,
        default: CONFIG.DEFAULT_ROLE
    }
},
{
    timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
