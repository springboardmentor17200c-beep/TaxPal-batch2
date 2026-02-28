const express = require("express");
const router = express.Router();
const {
  getBudgets,
  setBudget,
  deleteBudget,
} = require("../controllers/budget.controller");
const protect = require("../middlewares/auth.middleware");

// Require authentication for all budget routes
router.use(protect);

router.route("/").get(getBudgets).post(setBudget);
router.route("/:id").delete(deleteBudget);

module.exports = router;
