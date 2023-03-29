const express = require("express");

const bugController = require("../controllers/bug");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const onlyManager = require("../middleware/onlyManager");
const isDev = require("../middleware/isDev");

//todo:  since for now token time is 1h thus not adding refresh token middleware

//Bug Routes
router.post("/bug", authMiddleware.verifyToken, isDev, bugController.createBug);
router.get("/bug", authMiddleware.verifyToken, isDev, bugController.getBugs);
router.get(
  "/bug/:id",
  authMiddleware.verifyToken,
  isDev,
  bugController.getBugByID
);
router.put(
  "/bug/:id",
  authMiddleware.verifyToken,
  isDev,
  bugController.updateBugByID
);
router.delete(
  "/bug/:id",
  authMiddleware.verifyToken,
  onlyManager,
  bugController.deleteBugByID
);

router.put(
  "/bug/assign/:id",
  authMiddleware.verifyToken,
  onlyManager,
  bugController.assignBug
);
router.put(
  "/bug/status/:id",
  authMiddleware.verifyToken,
  bugController.updateBugStatus
);

module.exports = router;
