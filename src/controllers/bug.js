const { and } = require("sequelize");
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

// exports.updateBugByID = (req, res, next) => {
//   const { id } = req.params;
//   const newBug = req.body;

//   Bug.findByIdAndUpdate(id, newBug)
//     .then(() => {
//       res.status(200).json({
//         message: "Successfully updated!",
//       });
//     })
//     .catch((err) => {
//       console.log("Failed to get Bug Record!", err.message);
//       res.status(500).json({
//         message: "Failed to get Bug Record!",
//         error: err.message,
//       });
//     });
// };

exports.getBugs = (req, res, next) => {
  const modelUser = User.build(req.current_user);
  Bug.findAll()
    .then((allBugs) => {
      if (req.current_user.role === "manager") {
        return res.status(200).json({
          message: "Successful",
          data: allBugs,
        });
      }

      //   const user_bugs = allBugs.filter(
      //     (itm) =>
      //       itm._creator.toString() === req.session.current_user._id.toString() ||
      //       itm.assigned_to.toString() === req.session.current_user._id.toString()
      //   );
      const user_bugs = modelUser.getBugs({ raw: true, plain: true });
      return user_bugs;
    })
    .then((user_bugs) => {
      console.log("user_bugs", user_bugs);
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
// exports.getBugByID = (req, res, next) => {
//   const { id } = req.params;
//   Bug.findById(id)
//     .then((result) => {
//       res.status(200).json({
//         message: "Success",
//         data: result,
//       });
//     })
//     .catch((err) => {
//       console.log("Failed to get Bug Record!", err.message);
//       res.status(500).json({
//         message: "Failed to get Bug Record!",
//         error: err.message,
//       });
//     });
// };

// exports.deleteBugByID = (req, res, next) => {
//   const { id } = req.params;

//   Bug.deleteOne({ _id: id })
//     .then((result) => {
//       if (result.deletedCount <= 0) {
//         return res.json({
//           message: "No Record Found with id: " + id,
//         });
//       }
//       res.json({
//         message: "Bug with id: " + id + " deleted successfully  ",
//         result: result,
//       });
//     })
//     .catch((err) => {
//       console.log("Failed to delete Bug with id: ", id);
//       res.json({
//         message: "Failed to delete bug with id: " + id,
//         error: err.message,
//       });
//     });
// };

// exports.assignBug = (req, res, next) => {
//   const bugID = req.params.id;
//   const { userID } = req.body;
//   let userExists = false;
//   if (!userID) {
//     return res.status(400).json({
//       message: "Invalid parameters",
//       error: "UserID not Found!",
//     });
//   }

//   User.findById(userID).then((response) => {
//     if (response) {
//       userExists = true;
//     }
//   });

//   Bug.findByIdAndUpdate(bugID, { assigned_to: userID })
//     .then((response) => {
//       console.log("UserExists: ", userExists);
//       if (!response || userExists === false) {
//         return res.status(404).json({
//           message: " No Record Found!",
//           error: "Kindly Check UserID / BugID",
//         });
//       }
//       return res.status(200).json({
//         message: `Bug with id ${response._id}  assigned to user with ID:  ${userID}`,
//       });
//     })
//     .catch((err) => {
//       res.json({
//         message: `Failed to assign bug with ID: ${bugID} to user with ID: ${userID}`,
//         error: err.message,
//       });
//     });
// };

// exports.updateBugStatus = (req, res, next) => {
//   let { id } = req.params;
//   let { status } = req.body;

//   let query;
//   switch (req.session.current_user.role) {
//     case "manager":
//       query = { _id: id };
//       break;
//     case "qa":
//       query = {
//         $and: [
//           { _id: id },
//           {
//             $or: [
//               { _creator: req.session.current_user._id },
//               { assigned_to: req.session.current_user._id },
//             ],
//           },
//         ],
//       };
//       break;
//     case "developer":
//       query = {
//         $and: [{ _id: id }, { assigned_to: req.session.current_user._id }],
//       };
//       break;
//   }

//   Bug.findOneAndUpdate(
//     query,
//     { status: status },
//     { runValidators: true, new: true }
//   )
//     .then((response) => {
//       if (!response) {
//         return res.status(401).json({
//           message: `Something went Wrong!`,
//           error: " Role Permission Restriction",
//         });
//       }
//       res.status(200).json({
//         message: `Bug Status changed to: ${status} Successfully`,
//         response: response,
//       });
//     })
//     .catch((err) => {
//       console.log("error: ", err.message);
//       res.status(500).json({
//         message: `Something Went Wrong!`,
//         error: err.message,
//       });
//     });
// };
