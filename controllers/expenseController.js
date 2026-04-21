const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
  try {
    let { amount, description, participants } = req.body;

    if (!amount || !participants || participants.length === 0) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const payer = req.user.id.toString();

    // Convert all to string
    participants = participants.map(id => id.toString());

    // Remove duplicates
    participants = [...new Set(participants)];

    // Ensure payer included correctly
    if (!participants.includes(payer)) {
      participants.push(payer);
    }

    const share = Number((amount / participants.length).toFixed(2));

    const splits = participants.map(userId => ({
      user: userId,
      amountOwed: userId === payer ? 0 : share
    }));

    const expense = new Expense({
      paidBy: payer,
      amount,
      description,
      splits
    });

    await expense.save();

    return res.json({
      message: "Expense added with auto split",
      data: expense
    });

  } catch (err) {
    console.log("ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};