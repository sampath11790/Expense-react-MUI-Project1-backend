const Sequelize = require("sequelize");
const db = require("../Utli/database");

const Order = db.define("orders", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  paymentid: Sequelize.STRING,
  orderid: Sequelize.STRING,
  status: Sequelize.STRING,
});

module.exports = Order;
