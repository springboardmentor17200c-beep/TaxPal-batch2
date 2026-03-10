const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  type: {
    type: String,
    enum: ["income", "expense"]
  },
  category: String,
  amount: Number,
  date: Date
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
