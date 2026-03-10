require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const connectDB = require("../config/db");

const seed = async () => {
  await connectDB();

  await User.deleteMany();
  await Transaction.deleteMany();

  const user = await User.create({
    name: "Demo User",
    email: "demo@example.com",
    password: "password123",
    country: "India",
  });

  await Transaction.insertMany([
    {
      user: user._id,
      type: "income",
      category: "Freelance",
      amount: 5000,
      date: new Date(),
    },
    {
      user: user._id,
      type: "expense",
      category: "Rent",
      amount: 2000,
      date: new Date(),
    },
  ]);

  await Category.insertMany([
    { name: "Salary", type: "income", isDefault: true },
    { name: "Freelance", type: "income", isDefault: true },
    { name: "Food", type: "expense", isDefault: true },
    { name: "Rent", type: "expense", isDefault: true },
    { name: "Utilities", type: "expense", isDefault: true },
    { name: "Transport", type: "expense", isDefault: true },
  ]);

  console.log("Seed complete");
  process.exit();
};

seed();