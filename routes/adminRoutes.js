import express from "express";
import { addUser, fetchUser } from "../controllers/adminControllers.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
const router = express.Router();

router.post('/add-user', verifyToken, authorizeRoles("admin", "superadmin"), addUser);
router.get('/fetch-user', verifyToken, authorizeRoles("admin", "superadmin"), fetchUser);

export default router;
