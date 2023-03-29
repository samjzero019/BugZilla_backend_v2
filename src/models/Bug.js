const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const bugSchemaDefinition = sequelize.define("Bug", {
  id: {
    type: Sequelize.DataTypes.UUID,
    allowNull: false,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  description: Sequelize.DataTypes.STRING,
  priority: {
    type: Sequelize.DataTypes.ENUM("low", "medium", "high"),
    allowNull: false,
    required: true,
  },
  deadline: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    required: true,
    validate: {
      isInt: true,
    },
  },
  status: {
    type: Sequelize.DataTypes.ENUM("pending", "in-progress", "completed"),
    defaultValue: "pending",
    allowNull: false,
  },
  assigned_to: {
    type: Sequelize.DataTypes.UUID,
  },
});

module.exports = bugSchemaDefinition;
