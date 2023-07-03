const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  releaseDate: {
    type: String,
  },
  backGroundImage: {
    type: String,
  },
  images: {
    type: [String],
  },
  price: {
    type: Number,
  },
  onSale: {
    type: Boolean,
  },
  numberOfPurchase: {
    type: Number,
  },
  description: {
    type: String,
  },
  video: {
    type: String,
  },
  id: {
    type: Number,
  },
  developers: {
    type: [String],
  },
  publishers: {
    type: [String],
  },
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
  ],
});

module.exports = mongoose.model("game", gameSchema, "games");
