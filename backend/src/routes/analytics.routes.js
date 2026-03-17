const router = require("express").Router();
const { protect: auth } = require("../middlewares/auth.middleware");
const controller = require("../controllers/analytics.controller");

router.use(auth);

router.get("/category-breakdown", controller.categoryBreakdown);
router.get("/yearly-overview", controller.yearlyOverview);

module.exports = router;