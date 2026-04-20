const express = require("express");
const router = express.Router();

const { addExpense } = require("../controllers/expenseController");
const { auth } = require("../middleware/authMiddleware");

router.post("/expense", auth, addExpense);

module.exports = router;
