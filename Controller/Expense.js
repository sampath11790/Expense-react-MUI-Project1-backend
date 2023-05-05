const Expense = require("../Module/expenses");

exports.getExpenses = (req, res, next) => {
  // console.log(req.user.getExpenses);
  // console.log(req.user.getExpenses());
  // Product.findAll()
  req.user
    .getExpenses()
    .then((data) => {
      // console.log("data");
      res.send(data);
    })
    .catch((err) => {
      console.log("err");
      console.log(err);
    });
};

exports.postProduct = (req, res, next) => {
  const name = req.body.name;
  const amount = req.body.amount;
  const description = req.body.description;
  // const user = req.user;
  // console.log(req.user);
  req.user
    .createExpense({
      name: name,
      description: description,
      amount: amount,
    })
    // user
    //   .create({
    //     name: name,
    //     description: description,
    //     amount: amount,
    //   })
    .then((data) => {
      console.log(data);
      res.json({ messsage: "success" });
    })
    .catch((err) => {
      console.log(err);
      res.json({ error: "faild" });
    });

  // console.log(req);
  console.log("controller");
};
exports.deleteProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  const expense = Expense.findOne({
    where: {
      id: prodId,
      UserId: req.user.id, // Make sure the expense belongs to the correct user
    },
  })

    .then((data) => {
      return data.destroy();
    })

    .then((data) => {
      res.json(data);
    })
    .catch((err) => console.log(err));

  // console.log(req);
  console.log("controller");
};
