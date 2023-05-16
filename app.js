//import modules
// const dotenv = require("dotenv");
// dotenv.config({ path: "./config.env" });
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require("./Utli/database");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

//Module
const User = require("./Module/user");
const Expenses = require("./Module/expenses");
const Order = require("./Module/orders");
const Forgetpassword = require("./Module/orders");
const BucketDate = require("./Module/BucketData");

//Router
const UserRouter = require("./Route/user");
const ExpenseRoute = require("./Route/Expense");
const PremiumRoute = require("./Route/Premium");
const PasswordRoute = require("./Route/Password");
const forgetpassword = require("./Module/forgetpassword");
const { request } = require("http");

//it will log req url and other information
const accesslogStream = fs.createReadStream(
  path.join(__dirname, "access.log"),
  {
    flags: "a",
  }
);

//middleware
app.use(cors());
app.use(helmet());
app.use(morgan("combined", { stream: accesslogStream }));
// app.use(tokenMiddleware);
// app.use(bcrypt());

app.use(bodyparser.json({ extended: false }));

app.use(bodyparser.urlencoded({ extended: true }));
// app.use(bodyparser.urlencoded({ extended: false }));
app.use(UserRouter);
app.use(ExpenseRoute);
app.use(PremiumRoute);
app.use(PasswordRoute);
app.use((req, res, next) => {
  // console.log(process.env);
  console.log("test");
  next();
});

//Relationship

User.hasMany(Expenses);
Expenses.belongsTo(User);
//order
User.hasMany(Order);
Order.belongsTo(User);

// forgetpassword
User.hasMany(Forgetpassword);
Forgetpassword.belongsTo(User);

//bucket
User.hasMany(BucketDate);
BucketDate.belongsTo(User);
//server listener
console.log(process.env.NODE_ENV);
db.sync()

  // db.sync({ force: true })
  .then(() => {
    app.listen(process.env.PORT || 5004, () => {
      console.log("connected");
    });
  })
  .catch((err) => console.log(err));
