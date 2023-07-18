const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create the schema for a user - include ref to  games id in fileds: cart, wishList,orders
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  image: {
    type: String,
  },
  location: {
    type: String,
  },
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "game",
    },
  ],
  wishList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "game",
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
    },
  ],
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("user", userSchema, "users");
