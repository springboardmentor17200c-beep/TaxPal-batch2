const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: { type: String, required: true },
    amount: { type: Number, required: true, min: 0.01 },
    date: { type: Date, required: true },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
