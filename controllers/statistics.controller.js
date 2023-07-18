const Order = require("../models/orderSchema");

/** average of the purchases number  per moth or year
 * 
 * @description Calculates statistical data in graphs based on the average cumulative amount of purchases per month.
 * Retrieves the average amount of orders grouped by year and month.
 * Sorts the results in ascending order by year and month.
 * Constructs an array of months and an array of average amounts.
 * Sends a response with the constructed data.
 */
const cumlatioveAmountPerMounth = async (req, res) => {
  try {
    const statistics = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$purchaseDate" },
            month: { $month: "$purchaseDate" },
          },
          averageAmount: { $avg: "$orderNumber" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);
    const months = [];
    const averages = [];

    statistics.forEach((statistic) => {
      const month = `${statistic._id.year}-${statistic._id.month}`;
      months.push(month);
      averages.push(statistic.averageAmount);
    });

    const data = {
      months: months,
      averages: averages,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(400).send("Something went wrong -> cumlatioveAmountPerMounth");
  }
};

/** total of the number of purchases per month
 * 
 * @description Calculates the total number of purchases per month.
 * Retrieves the count of orders grouped by year and month.
 * Sorts the results in ascending order by year and month.
 * Constructs an array of months and an array of totals.
 * Sends a response with the constructed data.
 */
const totalNumberOfPurchasesPerMonth = async (req, res) => {
  try {
    const statistics = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$purchaseDate" },
            month: { $month: "$purchaseDate" },
          },
          totalPurchases: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const months = [];
    const totals = [];

    statistics.forEach((statistic) => {
      const month = `${statistic._id.year}-${statistic._id.month}`;
      months.push(month);
      totals.push(statistic.totalPurchases);
    });

    const data = {
      months: months,
      totals: totals,
    };

    res.status(200).json(data);
  } catch (error) {
    res
      .status(400)
      .send("Something went wrong -> totalNumberOfPurchasesPerMonth");
  }
};

module.exports = {
  cumlatioveAmountPerMounth,
  totalNumberOfPurchasesPerMonth,
};
