const express = require("express");

const bugController = require("../controllers/bug");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const onlyManager = require("../middleware/onlyManager");
const isDev = require("../middleware/isDev");

//todo:  since for now token time is 1h thus not adding refresh token middleware

//Bug Routes
router.post("/", authMiddleware.verifyToken, isDev, bugController.createBug);
router.get("/", authMiddleware.verifyToken, isDev, bugController.getBugs);
router.get(
  "/:id",
  authMiddleware.verifyToken,
  isDev,
  bugController.getBugByID
);
router.put(
  "/:id",
  authMiddleware.verifyToken,
  isDev,
  bugController.updateBugByID
);
router.delete(
  "/:id",
  authMiddleware.verifyToken,
  onlyManager,
  bugController.deleteBugByID
);

router.put(
  "/assign/:id",
  authMiddleware.verifyToken,
  onlyManager,
  bugController.assignBug
);
router.put(
  "/status/:id",
  authMiddleware.verifyToken,
  bugController.updateBugStatus
);

module.exports = router;
