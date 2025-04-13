import express from "express";
import { getClient, addClient } from "../controllers/clientController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all clients
router.get("/:id", getClient);

// Add a new client
router.post("/add",authMiddleware , addClient);

// // Update client details
// router.put("/:id", updateClient);

// // Delete a client
// router.delete("/:id", deleteClient);

export default router;

