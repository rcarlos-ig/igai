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
              console.log("Wrong email");
              if (req.session.flash) req.session.flash.error = [];
              return done(null, false, {
                message: "Usuário ou senha inválida.",
              });
            }
            //Match Password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                user.accesses += 1;
                user.save();
                return done(null, user);
              } else {
                console.log("Wrong password");
                if (req.session.flash) req.session.flash.error = [];
                return done(null, false, {
                  message: "Usuário ou senha inválida.",
                });
              }
            });
          })
          .catch((err) => console.log(err));
      }
    )
  );

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(async (id, done) => {
    User.findById(id).then((user) => {
      done(null, user);
    });
  });
};

module.exports = {
  loginCheck,
};
