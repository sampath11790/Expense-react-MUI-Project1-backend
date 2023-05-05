const express = require("express");
const Expense = require("../Controller/Expense");
const tokenMiddleware = require("../Middleware/tokenValidation");
const router = express.Router();
// router.use(tokenMiddleware);
router.get("/expense", tokenMiddleware, Expense.getExpenses);
router.post("/post-product", tokenMiddleware, Expense.postProduct);
router.delete(
  "/post-product/:productId",
  tokenMiddleware,
  Expense.deleteProduct
);

module.exports = router;
