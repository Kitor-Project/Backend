// define the routs for the statistics methods.

const express = require("express");
const statisticsController = require("../controllers/statistics.controller");
const authMiddleware = require("../utills/auth.middleware");
const router = express.Router();

router.get(
  "/cumulativeAmountOfPurchasesPerMonth",statisticsController.cumlatioveAmountPerMounth);
router.get(
  "/totalNumberOfPurchasesPerMonth", statisticsController.totalNumberOfPurchasesPerMonth);

module.exports = router;
