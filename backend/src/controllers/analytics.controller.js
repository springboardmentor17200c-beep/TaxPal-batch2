const analyticsService = require("../services/analytics.service");

exports.categoryBreakdown = async (req, res, next) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({
        message: "Month query parameter is required",
      });
    }

    const result = await analyticsService.categoryBreakdown(
      req.user,
      month
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.yearlyOverview = async (req, res, next) => {
  try {
    const { year } = req.query;
    const selectedYear = year || new Date().getFullYear();
    
    const result = await analyticsService.yearlyOverview(
      req.user,
      parseInt(selectedYear)
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
};