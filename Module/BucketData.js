const Sequelize = require("sequelize");
const db = require("../Utli/database");

const BucketDate = db.define("bucketdatas", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  Location: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = BucketDate;
