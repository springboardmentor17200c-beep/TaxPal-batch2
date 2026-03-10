
const dashboardService = require("../services/dashboardService");

exports.getDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboard(req.user);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
