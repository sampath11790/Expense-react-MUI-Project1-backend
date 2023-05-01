const User = require("../Module/user");

//post userdata
exports.PostUser = (req, res, next) => {
  //   res.send("some text");
  console.log(req.body);
  const obj = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  User.create(obj)
    .then((data) => {
      console.log(data);
      res.send(req.body);
    })
    .catch((err) => {
      res.status(403).send(err);
    });
};
