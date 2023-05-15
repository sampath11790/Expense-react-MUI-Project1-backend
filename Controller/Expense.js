const Expense = require("../Module/expenses");
const StoreFileAWS = require("../service/awshandleing");
const sequelize = require("../Utli/database");
const UpdateBucketDate = require("../service/bucketdata");
const addTotalamount = (user, currentamount, transaction) => {
  if (isNaN(user.totalcost)) {
    const totalcost = Number(currentamount);
    console.log("totalcost", totalcost);
    return user.update({ totalcost: totalcost });
  }
  const totalcost = user.totalcost + Number(currentamount);
  return user.update({ totalcost: totalcost }, transaction);
};

const reduceTotalamount = (user, currentamount = 0, transaction) => {
  const totalcost = user.totalcost - Number(currentamount);
  return user.update({ totalcost: totalcost }, transaction);
};

exports.getExpenses = async (req, res, next) => {
  // console.log(req.user.getExpenses);

  // console.log(req.user.getExpenses());
  // Product.findAll()
  const pageCount = Number(req.query.pageCount) || 2;
  const page = req.query.page || 1;
  console.log("req.query.pageCount", req.query.pageCount);
  console.log("req.query.page", req.query.page);
  const count = await req.user.countExpenses();

  req.user
    .getExpenses({
      offset: (page - 1) * pageCount,
      limit: pageCount,
    })
    .then((data) => {
      console.log("data", data);
      console.log(data);
      res.json({ data, count: Math.ceil(count / pageCount) });
    })

    //test

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
  const userresponse = await reduceTotalamount(req.user, expense.amount, {
    transaction: t,
  });
  const destroy = await expense.destroy();

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

exports.getDownloadExpenses = async (req, res, next) => {
  try {
    const expenses = await req.user.getExpenses();
    const stringifydata = JSON.stringify(expenses);
    const data = await StoreFileAWS(stringifydata, req.user.id);

    const bucket = await UpdateBucketDate(req.user, data.Location);

    res.status(200).json({ message: "successfull", bucket });
  } catch (err) {
    res.status(400).json({ error: "failed", data: err });
  }
};
