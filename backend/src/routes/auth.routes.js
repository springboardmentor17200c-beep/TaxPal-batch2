const router = require("express").Router();
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");

router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  authController.register
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  authController.login
);

const { protect } = require("../middlewares/auth.middleware");

// 🔥 GET CURRENT USER
router.get(
  "/me",
  protect,
  authController.getCurrentUser
);

module.exports = router;
