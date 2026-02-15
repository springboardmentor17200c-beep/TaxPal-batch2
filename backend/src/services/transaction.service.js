const Transaction = require("../models/transaction.model");

exports.createTransaction = async (data) => {
  return await Transaction.create(data);
};

exports.getTransactions = async (userId, filters) => {
  const query = { user: userId };

  if (filters.type) query.type = filters.type;

  if (filters.month) {
    const start = new Date(filters.month + "-01");
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    query.date = { $gte: start, $lt: end };
  }

  return await Transaction.find(query).sort({ date: -1 });
};

exports.deleteTransaction = async (id, userId) => {
  const transaction = await Transaction.findOne({ _id: id, user: userId });
  if (!transaction) {
    const error = new Error("Transaction not found");
    error.statusCode = 404;
    throw error;
  }

  await transaction.deleteOne();
};
