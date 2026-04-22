const Settlement = require("../models/Settlement");

exports.settle = async (req, res) => {
  try {
    const from = req.user.id;
    const { toUserId, amount } = req.body;

    if (!toUserId || !amount) {
      return res.status(400).json({ message: "Invalid data" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const settlement = new Settlement({
      from,
      to: toUserId,
      amount
    });

    await settlement.save();

    return res.json({
      message: "Settlement recorded",
      data: settlement
    });

  } catch (err) {
    console.log("ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
