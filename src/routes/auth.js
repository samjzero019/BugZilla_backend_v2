const express = require("express");

const authController = require("../controllers/auth");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authMiddleware.verifyToken, authController.logout);

module.exports = router;
