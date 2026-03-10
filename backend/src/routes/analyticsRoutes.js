
const router = require("express").Router();
const { protect: auth } = require("../middlewares/authMiddleware");
const controller = require("../controllers/analyticsController");

router.use(auth);

router.get("/category-breakdown", controller.categoryBreakdown);

module.exports = router;
