const Settlement = require("../models/Settlement");
const User = require("../models/User");

// Payer requests to settle (marks as pending)
exports.settle = async (req, res) => {
  try {
    const from = req.user.id;
    const { toUsername, amount } = req.body;

    if (!toUsername || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid data or amount" });
    }

    const toUser = await User.findOne({ username: toUsername });
    if (!toUser) {
      return res.status(400).json({ message: `User not found: ${toUsername}` });
    }

    const settlement = new Settlement({
      from,
      to: toUser._id,
      amount,
      status: "pending" // Explicitly pending until payee confirms
    });

    await settlement.save();

    return res.json({
      message: "Settlement request sent to payee for confirmation.",
      data: settlement
    });

  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Payee gets their pending settlement requests
exports.getPending = async (req, res) => {
  try {
    const pending = await Settlement.find({
      to: req.user.id,
      status: "pending"
    }).populate("from", "username");

    return res.json(pending);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Payee responds to a pending settlement request
exports.respond = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "completed" or "declined"

    if (!["completed", "declined"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const settlement = await Settlement.findOne({ _id: id, to: req.user.id });
    if (!settlement) {
      return res.status(404).json({ message: "Settlement request not found" });
    }

    if (settlement.status !== "pending") {
      return res.status(400).json({ message: "Settlement is already processed" });
    }

    settlement.status = status;
    await settlement.save();

    return res.json({ message: `Settlement marked as ${status}`, data: settlement });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
