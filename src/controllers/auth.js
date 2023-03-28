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
        Possible_Solution:
          "User with this Email might Already exists/Invalid Role",
      });
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ where: { email: email } })
    .then((response) => {
      if (!bcrypt.compare(password, response.dataValues.password)) {
        return res.status(400).json({
          message: "Invalid Password",
        });
      }
      //  JWT
      const token = jwt.sign(
        { user: response.dataValues },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
        // todo: incase there is no frontend then  alternate solution of small span token could be giving refresh token to third party to handle
        // todo: or just increase time for now till true use case has been found
      );

      if (res.cookie["x-auth-token"]) {
        res.cookie["x-auth-token"] = "";
      }

      res.cookie("x-auth-token", token, {
        maxAge: 1000 * 60 * 60, // 1h
        httpOnly: true,
      });

      res.status(200).json({
        message: "User Login Successful",
        response: response,
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
  res.clearCookie("x-auth-token");
  res.status(200).json({
    message: "User Logout Successful",
  });
};
