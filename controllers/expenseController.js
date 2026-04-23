const Expense = require("../models/Expense");
const User = require("../models/User");

exports.addExpense = async (req, res) => {
  try {
    let { amount, description, participants, paidByUsername } = req.body;

    if (!amount || !participants || participants.length === 0) {
      return res.status(400).json({ message: "Invalid data" });
    }

    let payer;
    if (paidByUsername) {
      const payerUser = await User.findOne({ username: paidByUsername });
      if (!payerUser) {
        return res.status(400).json({ message: `Payer not found: ${paidByUsername}` });
      }
      payer = payerUser._id.toString();
    } else {
      payer = req.user.id.toString();
    }

    // Find users by usernames
    const users = await User.find({ username: { $in: participants } });
    
    // Check if any username was not found
    const foundUsernames = users.map(u => u.username);
    const missingUsernames = participants.filter(username => !foundUsernames.includes(username));
    
    if (missingUsernames.length > 0) {
      return res.status(400).json({ message: `Users not found: ${missingUsernames.join(", ")}` });
    }

    // Convert found users to IDs
    let participantIds = users.map(u => u._id.toString());

    // Remove duplicates
    participantIds = [...new Set(participantIds)];

    // Ensure payer included correctly
    if (!participantIds.includes(payer)) {
      participantIds.push(payer);
    }

    const share = Number((amount / participantIds.length).toFixed(2));

    const splits = participantIds.map(userId => ({
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