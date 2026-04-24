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
    })
    .populate("paidBy", "username")
    .populate("splits.user", "username");
    
    const settlements = await Settlement.find({
      $or: [
        { from: currentUser },
        { to: currentUser }
      ],
      status: "completed"
    });

    console.log("EXPENSES:", expenses);
    console.log("SETTLEMENTS:", settlements);
    console.log("CURRENT USER:", currentUser);

    const netBalances = {};
    const userMap = {};

    for (let expense of expenses) {
      const payerId = expense.paidBy._id.toString();
      userMap[payerId] = expense.paidBy.username;

      for (let split of expense.splits) {
        const userId = split.user._id.toString();
        const username = split.user.username;
        const amount = split.amountOwed;

        userMap[userId] = username;

        if (userId === payerId) continue;

        // If YOU owe someone
        if (userId === currentUser) {
          if (!netBalances[payerId]) netBalances[payerId] = 0;
          netBalances[payerId] -= amount;
        }

        // If someone owes YOU
        if (payerId === currentUser) {
          if (!netBalances[userId]) netBalances[userId] = 0;
          netBalances[userId] += amount;
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

    console.log("NET BALANCES:", netBalances);

    // Clean output (remove zeros, format direction)
    const result = {};

    for (let userId in netBalances) {
      const amount = netBalances[userId];

      if (amount > 0) {
        result[userId] = {
          name: userMap[userId] || "Unknown User",
          owesYou: amount
        };
      } else if (amount < 0) {
        result[userId] = {
          name: userMap[userId] || "Unknown User",
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