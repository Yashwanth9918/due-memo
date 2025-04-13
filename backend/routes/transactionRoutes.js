import express from "express";
import { getTransactionById, addTransaction } from "../controllers/transactionController.js";

const router = express.Router();

// Get all transactions
router.get("/:id", getTransactionById);

// Add a new transaction
router.post("/", addTransaction);



export default router;