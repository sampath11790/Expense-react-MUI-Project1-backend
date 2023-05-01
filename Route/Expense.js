const express = require("express");
const Expense = require("../Controller/Expense");

const router = express.Router();
router.get("/expense", Expense.getComment);
router.post("/post-product", Expense.postProduct);
router.delete("/post-product/:productId", Expense.deleteProduct);

module.exports = router;
