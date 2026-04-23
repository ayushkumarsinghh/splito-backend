const Settlement = require("../models/Settlement");
const User = require("../models/User");

exports.settle = async (req, res) => {
  try {
    const from = req.user.id;
    const { toUsername, amount } = req.body;

    if (!toUsername || !amount) {
      return res.status(400).json({ message: "Invalid data" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const toUser = await User.findOne({ username: toUsername });
    if (!toUser) {
      return res.status(400).json({ message: `User not found: ${toUsername}` });
    }

    const settlement = new Settlement({
      from,
      to: toUser._id,
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
