const User = require("../models/User");
const Bug = require("../models/Bug");
const Comment = require("../models/Comment");

exports.createComment = (req, res, next) => {
  const { text, bugID } = req.body;

  if (!text || !bugID) {
    return res.status(400).json({
      message: "Invalid parameters",
      error: "invalid bugID",
    });
  }

  const modelUser = User.build(req.current_user);
  //todo: use async/await to remove this nested promises/callback hell
  Bug.findByPk(bugID)
    .then((bug) => {
      bug
        .createComment({ text })
        .then((result) => {
          return result.setUser(modelUser);
        })
        .then((response) => {
          if (response) {
            res.status(200).json({
              message: "Comment created successfully with associated data",
              response: response,
            });
          }
        })
        .catch((err) => {
          console.log("err", err.message);
        });
    })
    .catch((err) => {
      console.log(`Failed to fetch Bug with bugID: ${bugID}`, err.message);
      res
        .status(500)
        .json({ message: "failed to Create Comment", error: err.message });
    });
};
exports.updateComment = (req, res, next) => {
  const { id } = req.params;
  const { text } = req.body;
  Comment.update({ text }, { where: { id: id } })
    .then((response) => {
      if (response[0] === 0) {
        return res.status(400).json({
          message: "Something Went Wrong!",
          error: "Might be Invalid ID!",
        });
      }
      return res.status(200).json({
        message: "Comment updated Successfully",
      });
    })
    .catch((err) => {
      console.log("Failed to update Comment!", err.message);
    });
};
exports.getAllComment = (req, res, next) => {
  Comment.findAll()
    .then((response) => {
      res.status(200).json({ message: "Success", response: response });
    })
    .catch((err) => {
      console.log("Failed to get All Comments");
      res
        .status(500)
        .json({ message: "Failed to get comment Records", error: err.message });
    });
};
exports.deleteCommentByID = (req, res, next) => {
  const { id } = req.params;
  Comment.destroy({ where: { id: id } })
    .then((response) => {
      if (response[0] === 0) {
        return res.status(400).json({
          message: "Something Went Wrong!",
          error: "Might be Invalid ID!",
        });
      }
      return res.status(200).json({
        message: "Comment deleted Successfully",
      });
    })
    .catch((err) => {
      console.log("Failed to delete Comment!", err.message);
      res.status(500).json({
        message: "Failed to Delete comment Records",
        error: err.message,
      });
    });
};
