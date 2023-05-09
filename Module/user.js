const Sequelize = require("sequelize");
const db = require("../Utli/database");

const User = db.define("users", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ispremium: Sequelize.BOOLEAN,
  totalcost: Sequelize.INTEGER,
});

module.exports = User;
