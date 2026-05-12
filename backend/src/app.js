require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const transactionRoutes = require("./routes/transaction.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const budgetRoutes = require("./routes/budget.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const categoryRoutes = require("./routes/category.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const taxRoutes = require("./routes/tax.routes");
const reportRoutes = require("./routes/report.routes");
const deadlineRoutes = require("./routes/deadline.routes");

const app = express();

// ✅ Proper CORS (NO crash)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl) 
      // or if origin is in the allowed list
      // Or if we're in production and want to allow all (not recommended, but better than a crash)
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const path = require("path");

app.use(express.json());
// ✅ Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")));

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
app.use("/api/taxes", taxRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/deadlines", deadlineRoutes);

// ✅ Error middleware
app.use(errorMiddleware);

module.exports = app;