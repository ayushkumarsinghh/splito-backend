const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
  try {
    const { amount, description, splits } = req.body;

    const expense = new Expense({
      paidBy: req.user.id,
      amount,
      description,
      splits
    });

    await expense.save();

    return res.json({ message: "Expense added", data: expense });

  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
