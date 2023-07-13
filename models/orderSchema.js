const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  games: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "game",
    },
  ],
  orderNumber: {
    type: Number,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("order", orderSchema, "orders");
