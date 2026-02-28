const Budget = require("../models/budget.model");

// @desc    Get all budgets for a user
// @route   GET /api/budgets
// @access  Private
exports.getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ user: req.user });
    res.status(200).json(budgets);
  } catch (error) {
    next(error);
  }
};

// @desc    Set or update a budget for a category
// @route   POST /api/budgets
// @access  Private
exports.setBudget = async (req, res, next) => {
  try {
    const { category, limit } = req.body;

    if (!category || limit === undefined) {
      const error = new Error("Please provide category and limit");
      error.statusCode = 400;
      throw error;
    }

    // Upsert budget (update if exists, create if not)
    const budget = await Budget.findOneAndUpdate(
      { user: req.user, category },
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
