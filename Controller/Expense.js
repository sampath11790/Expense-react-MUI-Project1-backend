const Expense = require("../Module/expenses");

const sequelize = require("../Utli/database");
const addTotalamount = (user, currentamount, transaction) => {
  if (user.totalcost != null) {
    const totalcost = user.totalcost + Number(currentamount);
    return user.update({ totalcost: totalcost }, transaction);
  }
  const totalcost = Number(currentamount);
  return user.update({ totalcost: totalcost });
};

const reduceTotalamount = (user, currentamount = 0, transaction) => {
  const totalcost = user.totalcost - Number(currentamount);
  return user.update({ totalcost: totalcost }, transaction);
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

exports.postProduct = async (req, res, next) => {
  const name = req.body.name;
  const amount = req.body.amount;
  const description = req.body.description;

  const t = await sequelize.transaction();
  const updateExpenses = req.user.createExpense(
    {
      name: name,
      description: description,
      amount: amount,
    },
    { transaction: t }
  );
  console.log(req.user.totalcost + amount);
  const userresponse = addTotalamount(req.user, amount, { transaction: t });
  Promise.all([updateExpenses, userresponse])
    .then(async (data) => {
      await t.commit();
      // console.log(data);
      res.json({ messsage: "success" });
    })
    .catch(async (err) => {
      await t.rollback();
      // console.log(err);
      res.json({ error: "faild", messsage: err });
    });

  // console.log(req);
  console.log("controller");
};
exports.deleteProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  const t = await sequelize.transaction();
  const expense = await Expense.findOne({
    where: {
      id: prodId,
      UserId: req.user.id, // Make sure the expense belongs to the correct user
    },
    transaction: t,
  });
  const userresponse = reduceTotalamount(req.user, expense.amount, {
    transaction: t,
  });
  const destroy = expense.destroy();

  Promise.all([userresponse, destroy])

    // .then((data) => {

    //    return data.destroy(req.user,);

    // })

    .then(async (data) => {
      await t.commit();
      // console.log(data);
      res.json({ messsage: "successfully deleted" });
    })
    .catch(async (err) => {
      await t.rollback();
      res.json({ error: "faild", messsage: err });
    });

  // console.log(req);
  console.log("controller");
};
