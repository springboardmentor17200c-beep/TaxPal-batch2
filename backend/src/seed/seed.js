require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user.model");
const Transaction = require("../models/transaction.model");
const connectDB = require("../config/database");

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

  console.log("Seed complete");
  process.exit();
};

seed();
