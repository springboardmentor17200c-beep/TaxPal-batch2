const Transaction = require("../models/Transaction");


// ✅ ADD INCOME / EXPENSE
exports.addTransaction = async (req, res) => {
  try {
    const { type, category, amount, date } = req.body;

    // Validation
    if (!type || !category || !amount || !date) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const newTransaction = new Transaction({
      user_id: req.user,   // comes from authMiddleware (logged-in user)
      type,                // income OR expense
      category,
      amount,
      date
    });

    const savedTransaction = await newTransaction.save();

    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ GET ALL TRANSACTIONS (Dashboard Data)
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user_id: req.user
    }).sort({ date: -1 });  // latest first

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
