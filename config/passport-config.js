// init the user fileds and define the valditions for each of them.

// import user service and user auth
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const userServices = require("../services/users.services");

// get the user email and id and check if there is user according to the email 
async function initialize(passport, email, id) {
  const authenticateUser = async (email, password, done) => {
    const user = await userServices.getUserByEmail(email);
    if (user == null) {
      return done(null, false, { message: "No user with that email" });
    }

    try {
      // check the password (encripted)
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (e) {
      return done(e);
    }
  };

  // save user id on passport libary. for saving user data.
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    return done(null, userServices.getUserById(id));
  });
}

module.exports = initialize;
