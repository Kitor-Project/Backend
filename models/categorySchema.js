const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  games: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "game" }],
  },
});

module.exports = mongoose.model("category", categorySchema, "categories");
