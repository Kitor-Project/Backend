const mongoose = require("mongoose");

// connect to mongodb using MONGO_URL var from env file (hidden file) 
const mongoConnect = () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // when we connect to mongo at the first time, we will print this note.
  mongoose.connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
  });
};
// define export function
module.exports = mongoConnect;
