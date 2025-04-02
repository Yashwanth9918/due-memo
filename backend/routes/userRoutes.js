import express from "express";
import { registerUser, loginUser,getUserById } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get user details (protected route)
router.get("/profile", authMiddleware, getUserById);

export default router;