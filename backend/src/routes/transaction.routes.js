const router = require("express").Router();
const { body } = require("express-validator");
const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/transaction.controller");

router.use(auth);

router.post(
  "/",
  [
    body("type").isIn(["income", "expense"]),
    body("amount").isFloat({ min: 0.01 }),
    body("date").custom((value) => {
      if (new Date(value) > new Date())
        throw new Error("Date cannot be future");
      return true;
    }),
  ],
  controller.create
);

router.get("/", controller.getAll);
router.get("/summary", controller.summary);
router.delete("/:id", controller.remove);

module.exports = router;
