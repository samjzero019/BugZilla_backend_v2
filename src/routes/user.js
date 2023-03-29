const express = require("express");

const userController = require("../controllers/user");
const authMiddleware = require("../middleware/auth");
const onlyManager = require("../middleware/onlyManager");
const router = express.Router();

//User Routes
router.get(
  "/",
  authMiddleware.refreshToken,
  authMiddleware.verifyToken,
  onlyManager,
  userController.getUsers
);
router.put(
  "/role/:id",
  authMiddleware.refreshToken,
  authMiddleware.verifyToken,
  onlyManager,
  userController.changeUserRole
);

module.exports = router;
