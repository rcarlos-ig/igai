// Requirements
const bcrypt = require("bcryptjs");
const path = require("path");

// Strategy
const LocalStrategy = require("passport-local").Strategy;

// Load model
const User = require(path.join(__dirname, "..", "..", "models", "User"));

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
              return done(
                null,
                false,
                req.flash("error", "E-mail não cadastrado.")
              );
            }
            //Match Password
            bcrypt.compare(password, user.password, (error, isMatch) => {
              if (error) throw error;
              if (isMatch) {
                user.accesses += 1;
                user.lastLogin = new Date;
                user.save();
                return done(null, user);
              } else {
                console.log("Wrong password");
                return done(
                  null,
                  false,
                  req.flash("error", "Senha incorreta.")
                );
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
  passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
      done(error, user);
    });
  });
};

module.exports = {
  loginCheck,
};
