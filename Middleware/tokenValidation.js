const jwt = require("jsonwebtoken");
const User = require("../Module/user");

const tokenValidation = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    const response = await jwt.verify(token, process.env.JWT_SECRET_KEY);

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
  } catch (err) {
    res
      .status(401)
      .json({ error: "yor are not authorized to acceess this page" });
  }
};
module.exports = tokenValidation;
