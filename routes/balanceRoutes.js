const express = require("express");
const router = express.Router();

const { getBalances } = require("../controllers/balanceController");
const { auth } = require("../middleware/authMiddleware");

router.get("/balances", auth, getBalances);

module.exports = router;
