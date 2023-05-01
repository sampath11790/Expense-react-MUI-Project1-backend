const express = require("express");
const User = require("../Controller/user");
const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("get request");
  //   res.send(req.body);
});

router.post("/user/signup", User.PostUser);
router.post("/user/login", User.login);

module.exports = router;
