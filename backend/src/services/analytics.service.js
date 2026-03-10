const Transaction = require("../models/transaction.model");
const mongoose = require("mongoose");

exports.categoryBreakdown = async (userId, month) => {
  const start = new Date(month + "-01");
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  const breakdown = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        type: "expense",
        date: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: "$category",
        totalSpent: { $sum: "$amount" },
      },
    },
  ]);

  const totalExpenses = breakdown.reduce((sum, c) => sum + c.totalSpent, 0);

  return breakdown.map((item) => ({
    category: item._id,
    totalSpent: item.totalSpent,
    percentageOfTotalExpenses:
      totalExpenses === 0 ? 0 : (item.totalSpent / totalExpenses) * 100,
  }));
};