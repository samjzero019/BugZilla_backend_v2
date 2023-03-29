const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Comment = sequelize.define("Comment", {
  id: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  text: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Comment;
