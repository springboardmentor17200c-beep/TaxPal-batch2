const Category = require("../models/category.model");
const Transaction = require("../models/transaction.model");

exports.createCategory = async (data, userId) => {
  const existing = await Category.findOne({
    name: data.name,
    user: userId,
  }).collation({ locale: "en", strength: 2 });

  if (existing) {
    const err = new Error("Category already exists");
    err.statusCode = 409;
    throw err;
  }

  return await Category.create({
    ...data,
    user: userId,
    isDefault: false,
  });
};

exports.updateCategory = async (id, data, userId) => {
  const category = await Category.findOne({ _id: id, user: userId });
  if (!category) {
    const err = new Error("Category not found");
    err.statusCode = 404;
    throw err;
  }
  if (category.isDefault) {
    const err = new Error("Cannot edit default category");
    err.statusCode = 403;
    throw err;
  }
  
  const oldName = category.name;
  if (data.name) category.name = data.name;
  if (data.type) category.type = data.type;
  
  await category.save();
  
  if (data.name && data.name !== oldName) {
      await Transaction.updateMany(
          { user: userId, category: oldName },
          { $set: { category: data.name } }
      );
  }
  return category;
};

exports.getCategories = async (userId) => {
  return await Category.find({
    $or: [{ isDefault: true }, { user: userId }],
  });
};

exports.deleteCategory = async (id, userId) => {
  const category = await Category.findById(id);

  if (!category) {
    const err = new Error("Category not found");
    err.statusCode = 404;
    throw err;
  }

  if (category.isDefault) {
    const err = new Error("Cannot delete default category");
    err.statusCode = 403;
    throw err;
  }

  const linked = await Transaction.findOne({ category: category.name });
  if (linked) {
    const err = new Error("Category linked to transactions");
    err.statusCode = 400;
    throw err;
  }

  if (category.user.toString() !== userId)
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });

  await category.deleteOne();
};