const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishListSchema = new Schema({
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
});

module.exports = mongoose.model("wishList", wishListSchema, "wishLists");
