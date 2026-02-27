// backend/src/routes/tax.routes.js

const express = require("express");
const router = express.Router();

const {
  calculateTaxController,
  getQuarterlyController,
} = require("../controllers/tax.controller");

// ROUTES

// POST - Calculate Tax
router.post("/calculate", calculateTaxController);

// GET - Quarterly Due Dates
router.get("/quarterly-dates", getQuarterlyController);

module.exports = router;