const Group = require("../models/Group");
const Invitation = require("../models/Invitation");
const User = require("../models/User");

exports.createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const group = new Group({
      name,
      description,
      members: [req.user.id],
      createdBy: req.user.id,
    });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id }).populate("members", "username email");
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.inviteToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { username } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Find user by username
    const invitee = await User.findOne({ username });
    if (!invitee) {
      return res.status(404).json({ message: `User "${username}" not found` });
    }

    // Check if user is already a member
    if (group.members.includes(invitee._id)) {
      return res.status(400).json({ message: "User is already a member" });
    }

    // Check for existing pending invitation
    const existingInvite = await Invitation.findOne({ 
      groupId, 
      inviteeEmail: invitee.email, 
      status: "pending" 
    });
    
    if (existingInvite) {
      return res.status(400).json({ message: "Invitation already sent to this user" });
    }

    const invitation = new Invitation({
      groupId,
      inviteeEmail: invitee.email,
      invitedBy: req.user.id,
    });

    await invitation.save();
    res.json({ message: `Invitation sent to ${username}`, invitation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPendingInvites = async (req, res) => {
  try {
    // Find invites for this user's email
    const user = await User.findById(req.user.id);
    const invites = await Invitation.find({ inviteeEmail: user.email, status: "pending" })
      .populate("groupId", "name")
      .populate("invitedBy", "username");
    res.json(invites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.respondToInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const invite = await Invitation.findById(inviteId);
    if (!invite) return res.status(404).json({ message: "Invitation not found" });

    const user = await User.findById(req.user.id);
    if (invite.inviteeEmail !== user.email) {
      return res.status(403).json({ message: "Not authorized to respond to this invite" });
    }

    invite.status = status;
    await invite.save();

    if (status === "accepted") {
      const group = await Group.findById(invite.groupId);
      if (!group.members.includes(user._id)) {
        group.members.push(user._id);
        await group.save();
      }
    }

    res.json({ message: `Invitation ${status}`, invite });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGroupBalances = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId).populate("members", "username");
    if (!group) return res.status(404).json({ message: "Group not found" });

    const Expense = require("../models/Expense");
    const expenses = await Expense.find({ groupId });

    const memberBalances = {};
    group.members.forEach((m) => {
      memberBalances[m._id.toString()] = {
        username: m.username,
        netBalance: 0,
      };
    });

    expenses.forEach((exp) => {
      const payerId = exp.paidBy.toString();
      if (memberBalances[payerId]) {
        memberBalances[payerId].netBalance += exp.amount;
      }

      exp.splits.forEach((split) => {
        const userId = split.user.toString();
        if (memberBalances[userId]) {
          memberBalances[userId].netBalance -= split.amountOwed;
        }
      });
    });

    res.json(memberBalances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
