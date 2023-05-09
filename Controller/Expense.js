const Expense = require("../Module/expenses");

const addTotalamount = (user, currentamount) => {
  if (user.totalcost != null) {
    const totalcost = user.totalcost + Number(currentamount);
    return user.update({ totalcost: totalcost });
  }
  const totalcost = Number(currentamount);
  return user.update({ totalcost: totalcost });
};

const reduceTotalamount = (user, currentamount = 0) => {
  const totalcost = user.totalcost - Number(currentamount);
  return user.update({ totalcost: totalcost });
};

exports.getExpenses = (req, res, next) => {
  // console.log(req.user.getExpenses);
  // console.log(req.user.getExpenses());
  // Product.findAll()
  req.user
    .getExpenses()
    .then((data) => {
      // console.log("data");
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
      // console.log("err");
      // console.log(err);
    });
};

exports.postProduct = (req, res, next) => {
  const name = req.body.name;
  const amount = req.body.amount;
  const description = req.body.description;
  // const user = req.user;
  // console.log(req.user);
  const updateExpenses = req.user.createExpense({
    name: name,
    description: description,
    amount: amount,
  });
  console.log(req.user.totalcost + amount);
  const userresponse = addTotalamount(req.user, amount);
  Promise.all([updateExpenses, userresponse])
    .then((data) => {
      // console.log(data);
      res.json({ messsage: "success" });
    })
    .catch((err) => {
      // console.log(err);
      res.json({ error: "faild", messsage: err });
    });

  // console.log(req);
  console.log("controller");
};
exports.deleteProduct = async (req, res, next) => {
  const prodId = req.params.productId;

  const expense = await Expense.findOne({
    where: {
      id: prodId,
      UserId: req.user.id, // Make sure the expense belongs to the correct user
    },
  });
  const userresponse = reduceTotalamount(req.user, expense.amount);
  const destroy = expense.destroy();

  Promise.all([userresponse, destroy])
    // .then((data) => {

    //    return data.destroy(req.user,);

    // })

    .then((data) => {
      // console.log(data);
      res.json({ messsage: "successfully deleted" });
    })
    .catch((err) => res.json({ error: "faild", messsage: err }));

  // console.log(req);
  console.log("controller");
};
