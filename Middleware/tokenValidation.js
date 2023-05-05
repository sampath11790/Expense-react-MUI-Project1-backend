const jwt = require("jsonwebtoken");
const User = require("../Module/user");
var secretKey =
  "4f1feeca525de4cdb064656007da3edac7895a87ff0ea865693300fb8b6e8f9c";
const tokenValidation = async (req, res, next) => {
  const token = req.header("Authorization");

  const response = await jwt.verify(token, secretKey);

  if (response.userId) {
    User.findByPk(response.userId)
      .then((userobj) => {
        // console.log(userobj);
        req.user = userobj;
        next();
      })
      .catch((err) => {
        res
          .status(401)
          .json({ error: "yor are not authorized to acceess this page" });
      });
    // console.log(response);
  } else {
    res
      .status(401)
      .json({ error: "yor are not authorized to acceess this page" });
  }
};
module.exports = tokenValidation;
