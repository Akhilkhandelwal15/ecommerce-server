import express from 'express';
import { getCurrentUser, loginUser, logoutUser, registerUser, resetPassword, verifyEmail} from '../controllers/authController.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();


router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/me", verifyToken, getCurrentUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", verifyEmail);
router.post("/reset-password", resetPassword);

export default router;