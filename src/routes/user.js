const express = require("express");

const userController = require("../controllers/user");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

//User Routes
router.get(
  "/users",
  authMiddleware.refreshToken,
  authMiddleware.verifyToken,
  userController.getUsers
);
router.put(
  "/user/role/:id",
  authMiddleware.refreshToken,
  authMiddleware.verifyToken,
  userController.changeUserRole
);

module.exports = router;
