const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create the schema for a wishList - contains: user , array of games (ids)
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
