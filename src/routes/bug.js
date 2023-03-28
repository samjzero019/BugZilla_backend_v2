const express = require("express");

const bugController = require("../controllers/bug");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

//Bug Routes
router.post("/bug", authMiddleware.verifyToken, bugController.createBug);
router.get("/bug", authMiddleware.verifyToken, bugController.getBugs);
// router.get("/bug/:id", authMiddleware.verifyToken, bugController.getBugByID);
// router.put("/bug/:id", authMiddleware.verifyToken, bugController.updateBugByID);
// router.delete("/bug/:id", authMiddleware.verifyToken, onlyManager, bugController.deleteBugByID);

// router.put("/bug/assign/:id", authMiddleware.verifyToken, onlyManager, bugController.assignBug);
// router.put("/bug/status/:id", authMiddleware.verifyToken, bugController.updateBugStatus);

module.exports = router;
