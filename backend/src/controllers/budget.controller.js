const Budget = require("../models/budget.model");

const Transaction = require("../models/transaction.model");
const Category = require("../models/category.model");

// @desc    Get all budgets for a user
// @route   GET /api/budgets
// @access  Private
exports.getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ user: req.user }).lean();
    
    // Add usage tracking to each budget
    const enrichedBudgets = await Promise.all(budgets.map(async (b) => {
      let start, end;
      if (b.month && b.month.includes('-')) {
          const [year, monthStr] = b.month.split('-');
          start = new Date(year, parseInt(monthStr) - 1, 1);
          end = new Date(year, parseInt(monthStr), 0, 23, 59, 59);
      } else {
          const d = new Date();
          start = new Date(d.getFullYear(), d.getMonth(), 1);
          end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      }

      const cat = await Category.findOne({ name: { $regex: new RegExp(`^${b.category}$`, 'i') }, user: req.user });
      let spent = 0;
      if (cat) {
          const transactions = await Transaction.find({
              user: req.user,
              category: cat.name,
              type: 'expense',
              date: { $gte: start, $lte: end }
          });
          spent = transactions.reduce((sum, t) => sum + t.amount, 0);
      } else {
          // Fallback if category not strictly found in Category collection but we still want to match
          const transactions = await Transaction.find({
              user: req.user,
              category: { $regex: new RegExp(`^${b.category}$`, 'i') },
              type: 'expense',
              date: { $gte: start, $lte: end }
          });
          spent = transactions.reduce((sum, t) => sum + t.amount, 0);
      }
      return {
          ...b,
          categoryName: cat ? cat.name : b.category,
          spent,
          remaining: Math.max(0, b.limit - spent)
      };
    }));

    res.status(200).json(enrichedBudgets);
  } catch (error) {
    next(error);
  }
};

// @desc    Set or update a budget for a category
// @route   POST /api/budgets
// @access  Private
exports.setBudget = async (req, res, next) => {
  try {
    const { category, limit, month } = req.body;
    let targetMonth = month;
    if (!targetMonth) {
        const d = new Date();
        targetMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }

    if (!category || limit === undefined) {
      const error = new Error("Please provide category and limit");
      error.statusCode = 400;
      throw error;
    }

    // Upsert budget (update if exists, create if not)
    const budget = await Budget.findOneAndUpdate(
      { user: req.user, category, month: targetMonth },
      { limit },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(budget);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
exports.deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!budget) {
      const error = new Error("Budget not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: "Budget removed" });
  } catch (error) {
    next(error);
  }
};
