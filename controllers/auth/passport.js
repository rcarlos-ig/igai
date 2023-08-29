// Requirements
const bcrypt = require("bcryptjs");
const path = require("path");

// Strategy
const LocalStrategy = require("passport-local").Strategy;

// Load model
const User = require(path.join(__dirname, "..", "..", "models", "user"));

// Login
const loginCheck = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        //Check user
        User.findOne({ email: email })
          .then((user) => {
            if (!user) {
              console.log("Wrong email or password.");
              return done(null, false, [
                req.flash("error", "E-mail ou senha incorretos."),
                req.flash("info", "Error found."),
              ]);
            }
            //Match Password
            bcrypt.compare(password, user.password, (error, isMatch) => {
              if (error) throw error;
              if (isMatch) {
                user.accesses += 1;
                user.save();
                return done(null, user);
              } else {
                console.log("Wrong email or password.");
                return done(null, false, [
                  req.flash("error", "E-mail ou senha incorretos."),
                  req.flash("info", "Error found."),
                ]);
              }
            });
          })
          .catch((error) => console.log(error));
      }
    )
  );

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  //; Deserialize user
  passport.deserializeUser(async (id, done) => {
    User.findById(id).then((user) => {
      done(null, user);
    });
  });
};

module.exports = {
  loginCheck,
};
