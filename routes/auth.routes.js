const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const authMiddleware = require("../utills/auth.middleware");
const router = express.Router();

const initializePassport = require("../config/passport-config");
initializePassport(
  passport,
  (email) => User.find((user) => user.email === email),
  (id) => User.find((user) => user.id === id)
);

router.get("/", authMiddleware.checkAuthenticated, (req, res) => {
  res.render("index.ejs");
});

router.get("/login", authMiddleware.checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

// router.post(
//   "/login",
//   authMiddleware.checkNotAuthenticated,
//   authMiddleware.validateLogin,
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//     failureFlash: true,
//   })
// );

router.post(
  "/login",
  authMiddleware.validateLogin,
  passport.authenticate("local"),
  (req, res) => {
    // If authentication is successful, this callback function will be executed
    res.sendStatus(200); // Send a success status code (e.g., 200)
  }
);

router.get("/register", authMiddleware.checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

router.post(
  "/register",
  // authMiddleware.checkNotAuthenticated,
  authMiddleware.validateFields,
  async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const checkUser = await User.findOne({ email: req.body.email });
      if (checkUser) {
        return res.status(402).json({ error: "Email already exists" });
      }
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        image: req.body.image,
        location: req.body.location,
      });
      user.save();
      res.sendStatus(200);
    } catch {
      res.sendStatus(500);
    }
  }
);

router.delete("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

module.exports = router;
