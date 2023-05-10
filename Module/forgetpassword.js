const Sequelize = require("sequelize");
const db = require("../Utli/database");

const forgetpassword = db.define("forgetpasswords", {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  isactive: Sequelize.BOOLEAN,
});

module.exports = forgetpassword;
