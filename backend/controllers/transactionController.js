import Transaction from "../models/transactions.js";
import Client from "../models/client.js";
import User from "../models/user.js"; 


export const addTransaction = async (req, res) => {
  const { userId, clientId, amount, type } = req.body;

  if (!userId || !clientId || !amount || !type) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    
    const transaction = new Transaction({ userId, clientId, amount, type });
    await transaction.save();

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    if (type === "debit") {
      client.totalDue += amount;
    } else if (type === "credit") {
      client.totalDue -= amount;
    }

    client.totalDue = Math.max(client.totalDue, 0);

    await client.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.transactions.push(transaction._id); 
    await user.save();

    res.status(201).json({
      message: "Transaction added successfully",
      transaction,
      updatedClient: client,
    });
  } catch (err) {
    console.error("Error in addTransaction:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    // console.log("transaction prob :",transaction);
    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
