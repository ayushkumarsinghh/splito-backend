const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const { auth } = require("../middleware/authMiddleware");

router.post("/groups", auth, groupController.createGroup);
router.get("/groups", auth, groupController.getUserGroups);
router.post("/groups/:groupId/invite", auth, groupController.inviteToGroup);
router.get("/invites", auth, groupController.getPendingInvites);
router.post("/invites/:inviteId/respond", auth, groupController.respondToInvite);
router.get("/groups/:groupId/balances", auth, groupController.getGroupBalances);

module.exports = router;
