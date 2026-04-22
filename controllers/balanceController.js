const Expense = require("../models/Expense");
const Settlement = require("../models/Settlement");


exports.getBalances = async (req, res) => {
  try {
    const currentUser = req.user.id.toString();

    const expenses = await Expense.find({
      $or: [
        { paidBy: currentUser },
        { "splits.user": currentUser }
      ]
    });
    
    const settlements = await Settlement.find({
      $or: [
        { from: currentUser },
        { to: currentUser }
      ]
    });

    console.log("EXPENSES:", expenses);
    console.log("SETTLEMENTS:", settlements);
    console.log("CURRENT USER:", currentUser);

    const netBalances = {};

    for (let expense of expenses) {
      const payer = expense.paidBy.toString();

      for (let split of expense.splits) {
        const user = split.user.toString();
        const amount = split.amountOwed;

        if (user === payer) continue;

        // If YOU owe someone
        if (user === currentUser) {
          if (!netBalances[payer]) netBalances[payer] = 0;
          netBalances[payer] -= amount;
        }

        // If someone owes YOU
        if (payer === currentUser) {
          if (!netBalances[user]) netBalances[user] = 0;
          netBalances[user] += amount;
        }
      }
    }

    // 🔥 FIXED settlement logic
    for (let s of settlements) {
      const from = s.from.toString();
      const to = s.to.toString();
      const amount = s.amount;

      console.log("SETTLEMENT LOOP:", {
        from,
        to,
        amount,
        currentUser
      });

      // YOU paid someone
      if (from === currentUser) {
        if (!netBalances[to]) netBalances[to] = 0;
        netBalances[to] += amount;
      }

      // Someone paid YOU
      if (to === currentUser) {
        if (!netBalances[from]) netBalances[from] = 0;
        netBalances[from] -= amount;   // ✅ FIXED
      }
    }

    // Clean output (remove zeros, format direction)
    const result = {};

    for (let user in netBalances) {
      const amount = netBalances[user];

      if (amount > 0) {
        result[user] = {
          owesYou: amount
        };
      } else if (amount < 0) {
        result[user] = {
          youOwe: Math.abs(amount)
        };
      }
    }

    return res.json({ balances: result });

  } catch (err) {
    console.log("ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};