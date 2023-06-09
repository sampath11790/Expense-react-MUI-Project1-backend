const User = require("../Module/user");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
//post userdata
exports.PostUser = (req, res, next) => {
  //   res.send("some text");
  // console.log(req.body);

  const saltRounds = 10;

  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    if (!err) {
      // console.log(err);
      const obj = {
        name: req.body.name,

        email: req.body.email,
        password: hash,
      };
      User.create(obj)
        .then((data) => {
          // console.log(data);
          res.status(200).json({ message: "success" });
        })
        .catch((err) => {
          res.status(403).json({ error: "failed" });
        });
    } else {
      // console.log(hash);
    }
  });
};

exports.login = async (req, res, next) => {
  //   res.send("some text");
  // console.log(req.body);
  const obj = {
    email: req.body.email,
    password: req.body.password,
    ispremium: false,
  };
  const data = await User.findAll({ where: { email: req.body.email } });

  if (data.length > 0) {
    const isMatch = await bcrypt.compare(obj.password, data[0].password);
    if (isMatch) {
      res.json({
        message: "success",
        token: getToken(data[0].id),
        ispremium: data[0].ispremium,
      });
    } else {
      res.status(401).send({ error: "User not authorized" });
    }
  } else {
    res.status(404).send({ error: "User not found" });
  }
};

function getToken(id) {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY);
}
