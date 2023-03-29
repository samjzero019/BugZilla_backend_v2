//ENV Configuration
require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");

const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/user");
const bugRoutes = require("./src/routes/bug");
const commentRoutes = require("./src/routes/comment");

const errorController = require("./src/controllers/error");
const configHeader = require("./src/utils/set-headers");
const sequelize = require("./src/utils/database");
const Sequelize = require("sequelize");
const cookieParser = require("cookie-parser");
const User = require("./src/models/User");
const Bug = require("./src/models/Bug");
const Comment = require("./src/models/Comment");

const server = express();

// Some Configuration
server.use(cookieParser()); // process.env.COOKIE_SECRET for signed cookie
server.use(express.json()); // for JSON type request
server.use(configHeader); // set Header for frontEnd/ preflight

// Routes
server.use("/api/v1", authRoutes);
server.use("/api/v1/user", userRoutes);
server.use("/api/v1/bug", bugRoutes);
server.use("/api/v1/comment", commentRoutes);

// Un-registered Router handler
server.use("/*", errorController.NotFound);

// DB Associations //todo: add m:n association
//Bug association
User.hasMany(Bug, {
  foreignKey: {
    name: "_creator",
    type: Sequelize.DataTypes.UUID,
  },
});

// Comment association
Comment.belongsTo(User);
Bug.hasMany(Comment);

// DB Configuration
sequelize
  .sync() // { force: true }
  .then((response) => {
    console.log(`Server is connect to ${response.config.database} as database`);
    server.listen(8080, () => {
      console.log("Backend Server is listening on  port 8080");
    });
  })
  .catch((err) => console.log("Database Connection Failed!!!", err.message));
