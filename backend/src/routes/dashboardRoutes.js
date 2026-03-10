
const router = require("express").Router();
const { protect: auth } = require("../middlewares/authMiddleware");
const controller = require("../controllers/dashboardController");

router.get("/", auth, controller.getDashboard);

module.exports = router;
