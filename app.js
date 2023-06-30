if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Install packages
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const mongoConnect = require("./config/mongoConnect");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./models/userSchema");

//Adding ejs
app.set("view-engine", "ejs");

//Initialize Server
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

//Routes
app.use("/", require("./routes/auth.routes"));
app.use("/profile", require("./routes/users.routes"));
app.use("/category", require("./routes/categories.routes"));
app.use("/game", require("./routes/games.routes"));
app.use("/order", require("./routes/orders.routes"));
app.use("/wishList", require("./routes/wishList.routes"));
app.use("/statistic", require("./routes/statistics.routes"));
app.use("/point", require("./routes/points.routes"));

const server = require("http").createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
const { handleClient } = require("./utills/socket.utils");
handleClient(io);

server.listen(3005, () => {
  console.log("Socket Server is running on port 3005");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  mongoConnect();
});
