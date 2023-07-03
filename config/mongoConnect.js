const mongoose = require("mongoose");

const mongoConnect = () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
  });
};

module.exports = mongoConnect;
