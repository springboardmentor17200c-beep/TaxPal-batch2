const express = require("express");
const router = express.Router();

// Import Controller Functions
const {
  addTransaction,
  getTransactions
} = require("../controllers/transactionController");

// Import Auth Middleware (to protect routes)
const authMiddleware = require("../middleWare/authMiddleware");


// ✅ Add Income / Expense
// POST → /api/transactions
router.post("/", authMiddleware, addTransaction);


// ✅ Get All Transactions (Dashboard)
// GET → /api/transactions
router.get("/", authMiddleware, getTransactions);


module.exports = router;
