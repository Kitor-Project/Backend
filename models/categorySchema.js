// create the schema for a category - contains: name , array of games.

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

// we will mapping the categoryschem to the name "category" (ref category). 
// we will save it on db under categories headline.
module.exports = mongoose.model("category", categorySchema, "categories");
