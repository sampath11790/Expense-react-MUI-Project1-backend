//import modules
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require("./Utli/database");

//Module
const User = require("./Module/user");
const Expenses = require("./Module/expenses");
const Order = require("./Module/orders");

//Router
const UserRouter = require("./Route/user");
const ExpenseRoute = require("./Route/Expense");
const PremiumRoute = require("./Route/Premium");
const PasswordRoute = require("./Route/Password");
//middleware
app.use(cors());
// app.use(tokenMiddleware);
// app.use(bcrypt());

app.use(bodyparser.json({ extended: false }));
// app.use(bodyparser.urlencoded({ extended: false }));
app.use(UserRouter);
app.use(ExpenseRoute);
app.use(PremiumRoute);
app.use(PasswordRoute);
app.use((req, res, next) => {
  console.log("test");
  next();
});

//Relationship

User.hasMany(Expenses);
Expenses.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);
//server listener

db.sync()

  // db.sync({ force: true })
  .then(() => {
    app.listen(5004, () => {
      console.log("connected");
    });
  })
  .catch((err) => console.log(err));
