const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const User = sequelize.define("User", {
  id: {
    type: Sequelize.DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  role: {
    type: Sequelize.ENUM("developer", "qa", "manager"),
    //   defaultValue: "developer",
    allowNull: false,
  },
});

module.exports = User;
