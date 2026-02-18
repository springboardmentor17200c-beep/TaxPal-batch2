const router = require("express").Router();
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// 🔐 REGISTER
router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  authController.register
);

// 🔐 LOGIN
router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").notEmpty(),
  ],
  authController.login
);

// 🔥 NEW — GET CURRENT USER
router.get(
  "/me",
  authMiddleware,
  authController.getCurrentUser
);

module.exports = router;
