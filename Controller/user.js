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

exports.login = (req, res, next) => {
  //   res.send("some text");
  console.log(req.body);
  const obj = {
    email: req.body.email,
    password: req.body.password,
  };
  User.findAll({ where: { email: req.body.email } })

    .then((data) => {
      console.log(data[0].email);
      if (data[0].password == obj.password) {
        res.json({ message: "success" });
      } else {
        res.status(404).send({ error: "enter valid email password" });
      }
      // res.send(req.body);
    })
    .catch((err) => {
      res.status(403).send(err);
    });
};
