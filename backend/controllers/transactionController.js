import Transaction from "../models/transactions.js";

// @desc    Add a new transaction
// @route   POST /api/v1/transactions
// @access  Public
export const addTransaction = async (req, res) => {
  const { clientId, amount, date } = req.body;

  try {
    const transaction = new Transaction({ clientId, amount, date });
    await transaction.save();
    res.status(201).json({ msg: "Transaction added successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Get transactions by client ID
// @route   GET /api/v1/transactions/:clientId
// @access  Public
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ clientId: req.params.clientId });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// @desc    Update a transaction
// @route   PUT /api/v1/transactions/:id
// @access  Public
export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { amount, date, status } = req.body;

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { amount, date, status },
      { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ msg: "Transaction not found" });
    }

    res.status(200).json({ msg: "Transaction updated successfully", updatedTransaction });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};