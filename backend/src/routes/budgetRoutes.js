const express = require("express");
const router = express.Router();
const {
  getBudgets,
  setBudget,
  deleteBudget,
} = require("../controllers/budgetController");
const { protect } = require("../middlewares/authMiddleware");

// Require authentication for all budget routes
router.use(protect);

router.route("/").get(getBudgets).post(setBudget);
router.route("/:id").delete(deleteBudget);

module.exports = router;