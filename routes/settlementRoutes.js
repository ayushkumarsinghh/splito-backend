const express = require("express");
const router = express.Router();

const { settle, getPending, respond } = require("../controllers/settlementController");
const { auth } = require("../middleware/authMiddleware");

router.post("/settle", auth, settle);
router.get("/settlements/pending", auth, getPending);
router.post("/settlements/:id/respond", auth, respond);

module.exports = router;
