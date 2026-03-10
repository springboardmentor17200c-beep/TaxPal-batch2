const { validationResult } = require("express-validator");
const service = require("../services/category.service");

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const category = await service.createCategory(req.body, req.user);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const categories = await service.getCategories(req.user);
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await service.deleteCategory(req.params.id, req.user);
    res.json({ message: "Category deleted" });
  } catch (err) {
    next(err);
  }
};