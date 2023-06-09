const express = require("express");
const Premium = require("../Controller/premium");
const router = express.Router();
const tokenMiddleware = require("../Middleware/tokenValidation");
router.get("/purchase/premium", tokenMiddleware, Premium.getPremium);
router.post("/response/premium", tokenMiddleware, Premium.postpaymentDetails);
router.get("/premium/leaderboard", tokenMiddleware, Premium.getLeaserboard);
module.exports = router;
