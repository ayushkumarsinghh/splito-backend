const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { auth } = require("../middleware/authMiddleware");

// All profile routes are protected
router.use(auth);

router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);
router.get("/:userId/payment-info", userController.getUserPaymentInfo);
router.get("/username/:username/payment-info", userController.getUserPaymentInfoByUsername);

module.exports = router;

