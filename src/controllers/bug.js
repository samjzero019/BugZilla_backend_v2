const { Op } = require("sequelize");
const Bug = require("../models/Bug");
const User = require("../models/User");

exports.createBug = (req, res, next) => {
  let { title, description, priority, deadline, status } = req.body;
  const modelUser = User.build(req.current_user);

  modelUser
    .createBug({
      title,
      description,
      priority,
      deadline,
      status,
    })
    .then((result) => {
      res
        .status(201)
        .json({ message: "Bug Created Successfully ", result: result });
    })
    .catch((err) => {
      console.log("Error During Bug Creation", err.message);
      res
        .status(500)
        .json({ message: "Bug Creation Failed", error: err.message });
    });
};

exports.updateBugByID = (req, res, next) => {
  const { id } = req.params;
  const newBug = req.body;

  Bug.update(newBug, {
    where: { [Op.and]: [{ id: id }, { _creator: req.current_user.id }] },
  })
    .then((response) => {
      if (response[0] <= 0) {
        return res.status(400).json({
          message: "Failed to get Bug Record!",
          error: "Record Not Found! For Logged User",
        });
      }
      res.status(200).json({
        message: "Successfully updated!",
      });
    })
    .catch((err) => {
      console.log("Failed to get Bug Record!", err.message);
      res.status(500).json({
        message: "Failed to get Bug Record!",
        error: err.message,
      });
    });
};

exports.getBugs = (req, res, next) => {
  const modelUser = User.build(req.current_user);
  Bug.findAll()
    .then((allBugs) => {
      if (req.current_user.role === "manager") {
        return allBugs;
      }
      const user_bugs = modelUser.getBugs();
      return user_bugs;
    })
    .then((user_bugs) => {
      return res.status(200).json({
        message: "Successfully fetched User created or assigned bugs",
        data: user_bugs,
      });
    })
    .catch((err) => {
      console.log("Failed to fetch all bugs", err.message);
      res.status(500).json({
        message: "Failed to fetch all bugs",
        error: err.message,
      });
    });
};
exports.getBugByID = (req, res, next) => {
  const { id } = req.params;
  Bug.findByPk(id)
    .then((response) => {
      if (!response) {
        return res.status(400).json({
          message: "Failed to get Bug Record!",
          error: "Bug not Found!",
        });
      }

      res.status(200).json({
        message: "Success",
        data: response,
      });
    })
    .catch((err) => {
      console.log("Failed to get Bug Record!", err.message);
      res.status(500).json({
        message: "Failed to get Bug Record!",
        error: err.message,
      });
    });
};

exports.deleteBugByID = (req, res, next) => {
  const { id } = req.params;

  Bug.destroy({ where: { id: id } })
    .then((response) => {
      if (response <= 0) {
        return res.json({
          message: "No Record Found with id: " + id,
        });
      }
      res.json({
        message: "Bug with id: " + id + " deleted successfully  ",
        result: "One Record Deleted Successfully",
      });
    })
    .catch((err) => {
      console.log("Failed to delete Bug with id: ", id);
      res.json({
        message: "Failed to delete bug with id: " + id,
        error: err.message,
      });
    });
};

exports.assignBug = (req, res, next) => {
  const bugID = req.params.id;
  const { userID } = req.body;
  let userExists = false;
  let isManagerRole = true;

  if (!userID) {
    return res.status(400).json({
      message: "Invalid parameters",
      error: "UserID not Found!",
    });
  }

  User.findByPk(userID)
    .then((response) => {
      if (response.dataValues.role !== "manager") {
        isManagerRole = false;
      }
      userExists = true;
    })
    .catch((err) => {
      console.log("failed to Get RequestUser for Bug assignment", err.message);
    });

  Bug.update({ assigned_to: userID }, { where: { id: bugID } })
    .then((response) => {
      if (response[0] <= 0 || userExists === false) {
        return res.status(404).json({
          message: " No Record Found!",
          error: "Kindly Check UserID / BugID",
        });
      } else if (isManagerRole) {
        return res.status(400).json({
          message: "Failed to assign Bug to User",
          error:
            "Role Restriction: Manager can assign Bugs to QA and Developer only",
        });
      }

      res.status(200).json({
        message: `Bug with id ${bugID}  assigned to user with ID:  ${userID}`,
      });
    })
    .catch((err) => {
      res.json({
        message: `Failed to assign bug with ID: ${bugID} to user with ID: ${userID}`,
        error: err.message,
      });
    });
};

exports.updateBugStatus = (req, res, next) => {
  let { id } = req.params;
  let { status } = req.body;

  let condition;
  switch (req.current_user.role) {
    case "manager":
      condition = { id: id };
      break;
    case "qa":
      condition = {
        [Op.and]: [
          { id: id },
          {
            [Op.or]: [
              { _creator: req.current_user.id },
              { assigned_to: req.current_user.id },
            ],
          },
        ],
      };
      break;
    case "developer":
      condition = {
        [Op.and]: [{ id: id }, { assigned_to: req.current_user.id }],
      };
      break;
  }

  Bug.update({ status: status }, { where: condition })
    .then((response) => {
      if (response[0] <= 0) {
        return res.status(400).json({
          message: `Something went Wrong!`,
          error: "Role Restriction/invalid record",
        });
      }
      res.status(200).json({
        message: `Bug Status changed to: ${status} Successfully`,
      });
    })
    .catch((err) => {
      console.log("error: ", err.message);
      res.status(500).json({
        message: `Something Went Wrong!`,
        error: err.message,
      });
    });
};
