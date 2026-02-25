const { validationResult } = require("express-validator");
const budgetService = require("../services/budget.service");

exports.create = async (req, res, next) => {
  try {
    // 1️⃣ Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const budget = await budgetService.createBudget(req.body, req.user);

    res.status(201).json({
      message: "Budget created successfully",
      data: budget,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({
        message: "Month query parameter is required (YYYY-MM)",
      });
    }

    const budgets = await budgetService.getBudgetsWithProgress(
      req.user,
      month
    );

    res.json({
      month,
      budgets,
    });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await budgetService.deleteBudget(req.params.id, req.user);

    res.json({
      message: "Budget deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};