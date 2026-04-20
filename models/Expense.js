const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  splits: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      amountOwed: {
        type: Number
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Expense", expenseSchema);
