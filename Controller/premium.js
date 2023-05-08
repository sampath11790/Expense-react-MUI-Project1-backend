const key_id = "rzp_test_A9qJ5OCERG73AY";
const key_secret = "kBi51TKHdLIXdB0vuHlA5PMX";
const Order = require("../Module/orders");
const Razorpay = require("razorpay");
const User = require("../Module/user");
const Expenses = require("../Module/expenses");
const sequelize = require("sequelize");

exports.getPremium = (req, res, next) => {
  // console.log("req.user", req.user);
  try {
    const rzp = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });
    const amount = 100;
    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (!err) {
        req.user
          .createOrder({
            orderid: order.id,
            status: "pending",
          })
          .then(() => {
            res.json({ order, key_id: rzp.key_id });
          })
          .catch((err) => {
            console.log(err);
            res.json(err);
          });
      } else {
        throw new Error(err);
      }
    });
  } catch (err) {
    res.status(401).json({ error: "somthing went wrong" });
  }
  console.log("getPremium");
};

exports.postpaymentDetails = async (req, res, next) => {
  console.log(req.body);
  const paymentid = req.body.razorpay_payment_id;
  const orderid = req.body.razorpay_order_id;
  const status = "success";
  const paymentDetails = {
    paymentid,
    status,
  };

  const order = await Order.findOne({ where: { orderid: orderid } });

  const updateOrder_detail = order.update(paymentDetails);
  const updateUser_states = req.user.update({ ispremium: true });

  Promise.all([updateOrder_detail, updateUser_states])
    .then((data) => {
      res.status(202).json({ message: "successfull" });
    })
    .catch((err) => res.status(401).json({ error: "failed" }));

  // req.user
  //   .createOrder(paymentDetails)
  //   .then((data) => {
  //     console.log(data);
  //     res.json({ message: "success" });
  //   })

  //   .catch((err) => {
  //     console.log(err);
  //     res.status(401).json({ error: "failed" });
  //   });
  // console.log(paymentDetails);
  // res.json({ message: "success" });
};

exports.getLeaserboard = async (req, res, next) => {
  // res.json({ message: "data sent to client" });

  try {
    const val = await User.findAll({
      attributes: [
        "id",
        "name",

        [sequelize.fn("SUM", sequelize.col("expenses.amount")), "totalCost"],
      ],
      include: [
        {
          model: Expenses,
          attributes: [],
        },
      ],
      group: ["users.id"],
      order: [["totalCost", "DESC"]],
    });
    console.log(val);
    res.status(200).json(val);
  } catch (err) {
    // console.log(err);
    res.status(401).json(err);
  }
};
