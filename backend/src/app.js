require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const transactionRoutes = require("./routes/transaction.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const budgetRoutes = require("./routes/budget.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const categoryRoutes = require("./routes/category.routes");
const budgetRoutes = require("./routes/budget.routes");
const analyticsRoutes = require("./routes/analytics.routes");

const app = express();

// ✅ Proper CORS (NO crash)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("TaxPal API is running...");
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/analytics", analyticsRoutes);

// ✅ Error middleware
app.use(errorMiddleware);

module.exports = app;