const Transaction = require("../models/transaction.model");
const mongoose = require("mongoose");

exports.getDashboard = async (userId) => {
  const match = { user: new mongoose.Types.ObjectId(userId) };

  const summary = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  let totalIncome = 0;
  let totalExpense = 0;

  summary.forEach((item) => {
    if (item._id === "income") totalIncome = item.total;
    if (item._id === "expense") totalExpense = item.total;
  });

  const recentTransactions = await Transaction.find({ user: userId })
    .sort({ date: -1 })
    .limit(5);

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    recentTransactions,
  };
};
