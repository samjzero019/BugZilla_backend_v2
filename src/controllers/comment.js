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
  //   console.log(User.prototype);
  //   console.log(Comment.prototype);
  //   console.log(Bug.prototype);
  const modelUser = User.build(req.current_user);

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
exports.updateComment = (req, res, next) => {};
exports.getAllComment = (req, res, next) => {};
exports.deleteCommentByID = (req, res, next) => {};
