const Expense = require("../models/Expense");
const User = require("../models/User");

exports.addExpense = async (req, res) => {
  try {
    let { amount, description, participants, paidByUsername, groupId } = req.body;

    if (!amount || (!participants && !groupId)) {
      return res.status(400).json({ message: "Invalid data: amount and either participants or groupId are required" });
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

    let participantIds = [];

    if (groupId) {
      const Group = require("../models/Group");
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ message: "Group not found" });
      
      // Use group members if no specific participants provided
      if (!participants || participants.length === 0) {
        participantIds = group.members.map(m => m.toString());
      } else {
        // Find users by usernames from the provided participants list
        const users = await User.find({ username: { $in: participants } });
        participantIds = users.map(u => u._id.toString());
      }
    } else {
      // Find users by usernames
      const users = await User.find({ username: { $in: participants } });
      participantIds = users.map(u => u._id.toString());
    }
    
    // Check if any participants were found (if not from group)
    if (participantIds.length === 0) {
      return res.status(400).json({ message: "No valid participants found" });
    }

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
      splits,
      groupId: groupId || null
    });

    await expense.save();

    return res.json({
      message: "Expense added successfully",
      data: expense
    });

  } catch (err) {
    console.log("ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const currentUser = req.user.id.toString();
    const { search, user, groupId } = req.query;

    let query = {};

    if (groupId) {
      query.groupId = groupId;
    } else {
      query = {
        $or: [
          { paidBy: currentUser },
          { "splits.user": currentUser }
        ]
      };
    }

    if (search) {
      query.description = { $regex: search, $options: "i" };
    }

    if (user) {
      // Filter expenses between current user and another specific user
      query = {
        $and: [
          {
            $or: [
              { paidBy: currentUser, "splits.user": user },
              { paidBy: user, "splits.user": currentUser }
            ]
          }
        ]
      };
    }

    const expenses = await Expense.find(query)
      .populate("paidBy", "username")
      .populate("splits.user", "username")
      .populate("groupId", "name")
      .sort({ createdAt: -1 });

    return res.json(expenses);
  } catch (err) {
    console.log("ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const currentUser = req.user.id.toString();

    // Get both expenses and settlements for activity
    const expenses = await Expense.find({
      $or: [
        { paidBy: currentUser },
        { "splits.user": currentUser }
      ]
    })
    .populate("paidBy", "username")
    .populate("groupId", "name")
    .limit(10)
    .sort({ createdAt: -1 });

    const Settlement = require("../models/Settlement");
    const settlements = await Settlement.find({
      $or: [
        { from: currentUser },
        { to: currentUser }
      ]
    })
    .populate("from", "username")
    .populate("to", "username")
    .limit(10)
    .sort({ createdAt: -1 });

    // Merge and format
    const activity = [
      ...expenses.map(e => ({
        type: "expense",
        id: e._id,
        description: e.description,
        amount: e.amount,
        paidBy: e.paidBy.username,
        isPayer: e.paidBy._id.toString() === currentUser,
        createdAt: e.createdAt,
        groupName: e.groupId?.name || null
      })),
      ...settlements.map(s => ({
        type: "settlement",
        id: s._id,
        from: s.from.username,
        to: s.to.username,
        amount: s.amount,
        isFromMe: s.from._id.toString() === currentUser,
        createdAt: s.createdAt
      }))
    ];

    activity.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json(activity.slice(0, 10));
  } catch (err) {
    console.log("ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};