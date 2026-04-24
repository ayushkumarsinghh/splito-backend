const express = require("express");
const router = express.Router();

const { addExpense, getExpenses, getRecentActivity } = require("../controllers/expenseController");
const { auth } = require("../middleware/authMiddleware");

router.post("/expense", auth, addExpense);
router.get("/expenses", auth, getExpenses);
router.get("/activity", auth, getRecentActivity);

module.exports = router;
