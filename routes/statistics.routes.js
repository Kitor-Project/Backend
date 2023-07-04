const express = require("express");
const statisticsController = require("../controllers/statistics.controller");
const authMiddleware = require("../utills/auth.middleware");
const router = express.Router();

router.get(
  "/cumulativeAmountOfPurchasesPerMonth",
  // authMiddleware.checkAuthenticated,
  statisticsController.cumlatioveAmountPerMounth
);
router.get(
  "/totalNumberOfPurchasesPerMonth",
  // authMiddleware.checkAuthenticated,
  statisticsController.totalNumberOfPurchasesPerMonth
);

module.exports = router;
