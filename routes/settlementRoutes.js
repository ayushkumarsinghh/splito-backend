const express = require("express");
const router = express.Router();

const { settle } = require("../controllers/settlementController");
const { auth } = require("../middleware/authMiddleware");

router.post("/settle", auth, settle);

module.exports = router;
