import express from "express";
import { getClients, addClient } from "../controllers/clientController.js";

const router = express.Router();

// Get all clients
router.get("/", getClients);

// Add a new client
router.post("/", addClient);

// // Update client details
// router.put("/:id", updateClient);

// // Delete a client
// router.delete("/:id", deleteClient);

export default router;

