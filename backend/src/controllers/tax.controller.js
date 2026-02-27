// backend/src/controllers/tax.controller.js

const {
  calculateTax,
  getQuarterlyDates,
} = require("../services/tax.service");

// CALCULATE TAX CONTROLLER
const calculateTaxController = (req, res) => {
  try {
    const { country, income } = req.body;

    if (!country || income === undefined) {
      return res.status(400).json({
        success: false,
        message: "Country and income are required",
      });
    }

    const tax = calculateTax(country, Number(income));

    return res.status(200).json({
      success: true,
      estimatedTax: tax,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET QUARTERLY DATES CONTROLLER
const getQuarterlyController = (req, res) => {
  try {
    const dates = getQuarterlyDates();

    return res.status(200).json({
      success: true,
      data: dates,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  calculateTaxController,
  getQuarterlyController,
};