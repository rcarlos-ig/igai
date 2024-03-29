// MongoDB Schemas
const User = require("../models/user");
const Token = require("../models/token");

// Requirements
const bcrypt = require("bcryptjs");
const passport = require("passport");
const ejs = require("ejs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const path = require("path");

// Logout
const logout = (req, res) => {
  if (req.user) {
    User.findById(req.user._id)
      .then((user) => {
        if (user) {
          user.lastLogin = new Date();
          user.save().catch((error) => console.log(error));
        }
        req.logout(function (err) {
          if (err) return next(err);
          req.session.destroy();
          console.log("User logged out.");
          res.redirect(process.env.PREFIX + "/login");
        });
      })
      .catch((error) => console.log(error));
  } else {
    req.logout(function (err) {
      if (err) return next(err);
      req.session.destroy();
      console.log("User logged out.");
      res.redirect(process.env.PREFIX + "/login");
    });
  }
};

// Create Register Token
const createToken = async (req, res, next) => {
  await new Token({
    userId: req.user._id,
    token: crypto.randomBytes(32).toString("hex"),
  })
    .save()
    .then((token) => {
      console.log("token created");
      let success = ["Token criado."];
      const link = `<a href="${process.env.PREFIX}/register?token=${token.token}" target="_blank" class="font-semibold underline">Registrar usuário</a>`;
      success.push(link);

      res.locals.success = success;
      next();
    });
};

// GET request for Register page
const registerView = (req, res) => {
  // Check token
  Token.findOne({
    token: req.query.token,
  })
    .then((token) => {
      if (token) {
        res.render("register", {
          token: token.token,
          errors: [""],
          user: req.user,
        });
      } else {
        console.log("Invalid link or expired.");
        res.render("login", {
          errors: ["Link inválido ou expirado."],
          user: req.user,
        });
      }
    })
    .catch((error) => console.log(error));
};

// POST Request for Register page
const registerUser = (req, res, next) => {
  const { name, email, password, token } = req.body;

  // Check token
  Token.findOne({
    token: token,
  })
    .then((tokenFound) => {
      if (!tokenFound) return;
      // Check user
      User.findOne({ email: email })
        .then((user) => {
          if (user) {
            res.locals.name = name;
            res.locals.email = email;
            res.locals.errors = ["E-mail já cadastrado."];
            res.locals.token = tokenFound.token;

            res.render("register");
          } else {
            // New user
            const newUser = new User({
              name,
              email,
              password,
              role: "basic",
              theme: "light",
            });
            //Password Hashing
            bcrypt.genSalt(10, (err, salt) =>
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save() // Save nes user on database
                  .then(() => {
                    tokenFound
                      .deleteOne()
                      .then(console.log("Deleted: " + tokenFound._id));

                    res.locals.success = ["Cadastro realizado."];
                    next();
                  })
                  .catch((err) => console.log(err));
              })
            );
          }
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
};

// GET request For Login page
const loginView = (req, res) => {
  if (req.flash("info").length > 0) res.locals.errors = req.flash("error");
  res.render("login");
};

//POST Request for Login page
const loginUser = (req, res) => {
  // Authenticate user
  passport.authenticate("local", {
    successRedirect: process.env.PREFIX + "/dashboard",
    failureRedirect: process.env.PREFIX + "/login",
    failureFlash: true,
  })(req, res);
};

// GET Request for new password page
const requestResetPasswordView = (_req, res) => {
  res.render("requestResetPassword");
};

// POST Request for new password page
const requestResetPassword = async (req, res, next) => {
  const { email } = req.body;

  // Check user
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        // Check token
        Token.findOne({ userId: user._id })
          .then(async (token) => {
            if (token) {
              console.log("token exists");
              token.deleteOne();
              console.log("token deleted");
            }

            // Create new token
            await new Token({
              userId: user._id,
              token: crypto.randomBytes(32).toString("hex"),
            })
              .save()
              .then(async (token) => {
                console.log("token created");
                // Redefine password page link
                const link = `${process.env.BASE_URL}${process.env.PREFIX}/password-reset?user=${user._id}&token=${token.token}`;

                // Redefine password mail body
                const html = await ejs.renderFile(
                  path.join(__dirname, "../", "views", "resetPasswordMail.ejs"),
                  { name: user.name, link }
                );

                // Send the email
                await sendEmail(user.email, html).then((result) => {
                  console.log(result.response);
                });

                res.locals.success = ["E-mail enviado com sucesso."];
                next();
              });
          })
          .catch((error) => console.log(error));
      } else {
        console.log("User not found.");

        res.locals.errors = ["E-mail não cadastrado."];
        res.render("requestResetPassword");
      }
    })
    .catch((error) => console.log(error));
};

// Get Request for resetting password
const resetPasswordView = (req, res) => {
  res.render("resetPassword", {
    userId: req.query.user,
    token: req.query.token,
  });
};

// POST Request for resetting the password
const resetPassword = (req, res, next) => {
  const { newPassword } = req.body;

  // Check user
  User.findById(req.query.user)
    .then((user) => {
      if (user) {
        // Check token
        Token.findOne({
          userId: user._id,
          token: req.query.token,
        })
          .then((token) => {
            if (token) {
              // Pasword hashing
              bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(newPassword, salt, (err, hash) => {
                  if (err) throw err;
                  user.password = hash;
                  user
                    .save()
                    .then(() => {
                      token
                        .deleteOne()
                        .then(console.log("Deleted: " + token._id));

                      res.locals.success = ["Senha criada com sucesso."];
                      next();
                    })
                    .catch((err) => console.log(err));
                })
              );
            } else {
              console.log("Invalid link or expired.");
              res.locals.errors = ["Link inválido ou expirado."];
              next();
            }
          })
          .catch((error) => console.log(error));
      } else {
        console.log("Invalid link or expired.");
        res.locals.errors = ["Link inválido ou expirado."];
        next();
      }
    })
    .catch((error) => console.log(error));
};

// POST request for setting the user theme
const setUserTheme = (req, _res) => {
  const { theme } = req.body;

  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        user.theme = theme;
        user.save().catch((error) => console.log(error));
        return true;
      } else {
        console.log("Invalid user ID.");
        return false;
      }
    })
    .catch((error) => console.log(error));
};

module.exports = {
  logout,
  createToken,
  registerView,
  loginView,
  registerUser,
  loginUser,
  requestResetPassword,
  requestResetPasswordView,
  resetPassword,
  resetPasswordView,
  setUserTheme,
};
