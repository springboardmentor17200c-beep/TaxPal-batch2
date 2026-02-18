const { validationResult } = require("express-validator");
const authService = require("../services/auth.service");
const { generateToken } = require("../utils/jwt");
const User = require("../models/user.model");

// 🔐 REGISTER
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const user = await authService.registerUser(req.body);
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
        income_bracket: user.income_bracket,
      },
    });
  } catch (err) {
    next(err);
  }
};

// 🔐 LOGIN
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const user = await authService.loginUser(
      req.body.email,
      req.body.password
    );

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
        income_bracket: user.income_bracket,
      },
    });
  } catch (err) {
    next(err);
  }
};

// 🔥 NEW — GET CURRENT USER (/auth/me)
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      country: user.country,
      income_bracket: user.income_bracket,
    });
  } catch (err) {
    next(err);
  }
};
