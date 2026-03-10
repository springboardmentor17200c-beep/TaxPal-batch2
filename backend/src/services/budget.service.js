
const Budget = require("../models/budget.model");
const Transaction = require("../models/transaction.model");
const Category = require("../models/category.model"); // 👈 THIS LINE
const mongoose = require("mongoose");

exports.createBudget = async (data, userId) => {

    // Find category by ID
    const category = await Category.findById(data.category);
  
    if (!category) {
      const err = new Error("Category not found");
      err.statusCode = 404;
      throw err;
    }
  
    // Ensure category belongs to user OR is default
    if (!category.isDefault && category.user?.toString() !== userId) {
      const err = new Error("Forbidden category access");
      err.statusCode = 403;
      throw err;
    }
  
    // Budget only for expense categories
    if (category.type !== "expense") {
      const err = new Error("Budget can only be created for expense categories");
      err.statusCode = 400;
      throw err;
    }
  
    try {
      return await Budget.create({
        user: userId,
        category: category._id,
        month: data.month,
        limit: data.limit,
      });
    } catch (error) {
      if (error.code === 11000) {
        const err = new Error(
          "Budget already exists for this category and month"
        );
        err.statusCode = 409;
        throw err;
      }
      throw error;
    }
  };