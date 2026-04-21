const Expense = require("../models/Expense");

exports.getBalances = async (req, res) => {
  try {
    const currentUser = req.user.id.toString();

    const expenses = await Expense.find();

    const balances = {};

    for (let expense of expenses) {
      const payer = expense.paidBy.toString();

      for (let split of expense.splits) {
        const user = split.user.toString();
        const amount = split.amountOwed;

        if (user === payer) continue;

        // Case 1: current user owes someone
        if (user === currentUser) {
          if (!balances[payer]) balances[payer] = 0;
          balances[payer] += amount;
        }

        // Case 2: someone owes current user
        if (payer === currentUser) {
          if (!balances[user]) balances[user] = 0;
          balances[user] += amount;
        }
      }
    }

    return res.json({ balances });

  } catch (err) {
    console.log("ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
