const express = require("express");
const router = express.Router();

// Import controller functions
const {
  registerUser,
  loginUser
} = require("../controllers/authController");


// ✅ Register Route
// POST → /api/auth/register
router.post("/register", registerUser);


// ✅ Login Route
// POST → /api/auth/login
router.post("/login", loginUser);


module.exports = router;
