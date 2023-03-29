const User = require("../models/User");

exports.getUsers = (req, res, next) => {
  User.findAll()
    .then((users) => {
      res.status(200).json({
        message: "Success",
        data: users,
      });
    })
    .catch((err) => {
      console.log("Failed to get Users!", err.message);
      res.status(500).json({
        message: "Failed to get Users",
        error: err.message,
      });
    });
};

exports.changeUserRole = (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;
  User.update({ role: role }, { where: { id: id } })
    .then((response) => {
      res.status(200).json({
        message: `User Role updated to ${role} Successfully`,
      });
    })
    .catch((err) => {
      console.log("Failed to update User Role");
      res.status(500).json({
        message: "Failed to get Users",
        error: err.message,
      });
    });
};
