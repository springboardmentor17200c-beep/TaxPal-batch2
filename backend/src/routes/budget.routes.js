const router = require("express").Router();
const { body, query } = require("express-validator");
const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/budget.controller");

router.use(auth);

router.post(
  "/",
  [
    body("category")
      .notEmpty()
      .withMessage("Category is required")
      .isMongoId()
      .withMessage("Invalid category ID"),

    body("month")
      .notEmpty()
      .withMessage("Month is required")
      .matches(/^\d{4}-(0[1-9]|1[0-2])$/)
      .withMessage("Month must be in YYYY-MM format"),

    body("limit")
      .notEmpty()
      .withMessage("Limit is required")
      .isFloat({ min: 0.01 })
      .withMessage("Limit must be greater than 0"),
  ],
  controller.create
);

router.get(
  "/",
  [
    query("month")
      .notEmpty()
      .withMessage("Month is required")
      .matches(/^\d{4}-(0[1-9]|1[0-2])$/)
      .withMessage("Month must be in YYYY-MM format"),
  ],
  controller.getAll
);

router.delete("/:id", controller.remove);

module.exports = router;