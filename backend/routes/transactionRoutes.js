import express from "express";
import { getTransactions, addTransaction, updateTransaction } from "../controllers/transactionController.js";

const router = express.Router();

// Get all transactions
router.get("/", getTransactions);

// Add a new transaction
router.post("/", addTransaction);

// Update a transaction
router.put("/:id", updateTransaction);


export default router;