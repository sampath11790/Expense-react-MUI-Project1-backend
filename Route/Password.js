// /password/forgotpassword

const express = require("express");
const tokenMiddleware = require("../Middleware/tokenValidation");
const Password = require("../Controller/password");
const router = express.Router();

router.post(
  "/password/forgotpassword",

  Password.getResetpasswordLink
);

module.exports = router;
