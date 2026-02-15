const { validationResult } = require("express-validator");
const transactionService = require("../services/transaction.service");
const Transaction = require("../models/transaction.model");

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const transaction = await transactionService.createTransaction({
      ...req.body,
      user: req.user,
    });

    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const transactions = await transactionService.getTransactions(
      req.user,
      req.query
    );
    res.json(transactions);
  } catch (err) {
    next(err);
  }
};

exports.summary = async (req, res, next) => {
  try {
    const match = { user: require("mongoose").Types.ObjectId(req.user) };

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

    res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await transactionService.deleteTransaction(req.params.id, req.user);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};
