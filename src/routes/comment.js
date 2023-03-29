const express = require("express");

const commentController = require("../controllers/comment");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.post("/", authMiddleware.verifyToken, commentController.createComment);
router.put("/:id", authMiddleware.verifyToken, commentController.updateComment);
router.get("/", authMiddleware.verifyToken, commentController.getAllComment);
router.delete(
  "/:id",
  authMiddleware.verifyToken,
  commentController.deleteCommentByID
);

module.exports = router;
