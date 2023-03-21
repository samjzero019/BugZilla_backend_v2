//ENV Configuration
require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");

const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/user");
const bugRoutes = require("./src/routes/bug");

const errorController = require("./src/controllers/error");
const configHeader = require("./src/utils/set-headers");
const sequelize = require("./src/utils/database");
require("./src/models/User");
require("./src/models/Bug");

const server = express();

// Some Configuration

server.use(express.json()); // for JSON type request
server.use(configHeader); // set Header for frontEnd/ preflight

// Routes
server.use("/api/v1", authRoutes);
server.use("/api/v1", userRoutes);
server.use("/api/v1", bugRoutes);

// Un-registered Router handler
server.use("/*", errorController.NotFound);

// DB Configuration
sequelize
  .sync()
  .then((response) => {
    console.log(`Server is connect to ${response.config.database} as database`);
    server.listen(8080, () => {
      console.log("Backend Server is listening on  port 8080");
    });
  })
  .catch((err) => console.log("Database Connection Failed!!!", err.message));
