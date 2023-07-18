// defines the user validatons( email, name, image....)

const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/userSchema");

/**
 * @details Middleware to check if user is authenticated
 */
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

/**
 * @details Middleware to check if user is not authenticated
 */
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  }
  res.status(401).json({ error: "User is not authenticated" });
}

/**
 * @details Middleware to validate validateLogin
 */
function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send({ error: "Missing email and/or password" });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.json({ error: "Invalid email format." });
  }
  req.session.user = { email: email, password: password };
  // TODO --> remove after testing!!
  console.log(req.session.user);
  next();
}

/**
 * @details Middleware to validate fields
 */
function validateFields(req, res, next) {
  const { name, image, location, email, password } = req.body;

  if (!name || !location || !email || !password) {
    return res.json({ error: "Missing fields" });
  }

  // Name validation
  const nameRegex = /^[a-zA-Z0-9\s]+$/;
  if (!nameRegex.test(name)) {
    return res.json({ error: "Invalid name format" });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email fromat." });
  }

  // Image validation
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(image) && image !== "") {
    return res.status(400).json({ error: "Invalid image URL format" });
  }

  // Location validation
  const locationRegex = /^[a-zA-Z0-9\s]+$/;
  if (!locationRegex.test(location)) {
    return res.status(400).json({ error: "Invalid location format" });
  }

  next();
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  validateLogin,
  validateFields,
};
