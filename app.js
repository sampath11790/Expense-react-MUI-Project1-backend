//import modules
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require("./Utli/database");
const bcrypt = require("bcrypt");

//Module
const User = require("./Module/user");
const Expenses = require("./Module/expenses");

//Router
const UserRouter = require("./Route/user");
//middleware
app.use(cors());
// app.use(bcrypt());

app.use(bodyparser.json({ extended: false }));
// app.use(bodyparser.urlencoded({ extended: false }));
app.use(UserRouter);
app.use((req, res, next) => {
  console.log("test");
  next();
});

//Relationship

User.hasMany(Expenses);
Expenses.belongsTo(User);

//server listener

db.sync()
  // db.sync({ force: true })
  .then(() => {
    app.listen(5004, () => {
      console.log("connected");
    });
  })
  .catch((err) => console.log(err));
