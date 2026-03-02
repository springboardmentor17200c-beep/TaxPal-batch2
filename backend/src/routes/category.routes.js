const router = require("express").Router();
const { body } = require("express-validator");
const { protect: auth } = require("../middlewares/auth.middleware");
const controller = require("../controllers/category.controller");

router.use(auth);

router.post(
  "/",
  [
    body("name").notEmpty(),
    body("type").isIn(["income", "expense"]),
  ],
  controller.create
);

router.get("/", controller.getAll);
router.delete("/:id", controller.remove);

module.exports = router;