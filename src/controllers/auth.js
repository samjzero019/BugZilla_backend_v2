const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = (req, res, next) => {
  const { email, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 12);

  User.create({ email: email, password: hashedPassword, role: role })
    .then((response) => {
      res.status(201).json({
        message: "User Registration Successful",
        response: {
          id: response.id,
          email: response.email,
          role: response.role,
          createdAt: response.createdAt,
        },
      });
    })
    .catch((err) => {
      console.log("Failed to create User: ", err.message);
      res.status(500).json({
        message: "User Registration Failed",
        error: err.message,
        Possible_Solution: "Email is set to unique thus try another email",
      });
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((response) => {
      if (!bcrypt.compare(password, response.dataValues.password)) {
        return res.status(400).json({
          message: "Invalid Password",
        });
      }
      // todo JWT
      const token = jwt.sign({ id: response.dataValues.id });
      res.status(200).json({
        message: "User Login Successful",
        response: {
          id: response.id,
          email: response.email,
          role: response.role,
          createdAt: response.createdAt,
        },
        token: token,
      });
    })
    .catch((err) => {
      console.log("Failed to Login  User: ", err.message);
      res.status(500).json({
        message: "User Login Failed",
        error: err.message,
      });
    });
};

exports.logout = (req, res, next) => {
  res.status(200).json({
    message: "User Logout Successful",
  });
};
