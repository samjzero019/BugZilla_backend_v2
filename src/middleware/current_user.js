const User = require("../models/User");
module.exports = (req, res, next) => {
  User.findOne({ where: { id: req.user_id } })
    .then((response) => {
      req.current_user = response.dataValues;
      next();
    })
    .catch((err) => {
      console.log(
        "Something went wrong while setting current_user",
        err.message
      );
      res.status(501).json({
        message: "Failed to Fetch User",
        error: err.message,
      });
    });
};
