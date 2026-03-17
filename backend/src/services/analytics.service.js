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

exports.yearlyOverview = async (user, year) => {
  const result = [];
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31, 23, 59, 59);

  const transactions = await Transaction.find({
    user: user._id,
    date: { $gte: startOfYear, $lte: endOfYear }
  });

  for (let m = 0; m < 12; m++) {
    const monthTransactions = transactions.filter(t => t.date.getMonth() === m);
    const income = monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    
    result.push({
      month: m + 1,
      income,
      expenses
    });
  }
  return result;
};