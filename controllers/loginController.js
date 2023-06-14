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
const {
  getSchools,
  getActiveSchools,
} = require("../controllers/schoolController");

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
          res.redirect("/igaie/login");
        });
      })
      .catch((error) => console.log(error));
  } else {
    req.logout(function (err) {
      if (err) return next(err);
      req.session.destroy();
      res.redirect("/igaie/login");
    });
  }
};

// Create Register Token
const createToken = async (req, res) => {
  const token = await new Token({
    userId: "6217d8c12bfa7e0528d3174e",
    token: crypto.randomBytes(32).toString("hex"),
  }).save();

  const schools = await getSchools();
  const activeSchools = await getActiveSchools();

  let chartLabels = [
    "Não Avaliado",
    "Ótimo",
    "Bom",
    "Regular",
    "Ruim",
    "Péssimo",
  ];

  let chartData = [0, 0, 0, 0, 0, 0];

  activeSchools.forEach((school) => {
    switch (school.avaliacao) {
      case chartLabels[1]:
        chartData[1] += 1;
        break;
      case chartLabels[2]:
        chartData[2] += 1;
        break;
      case chartLabels[3]:
        chartData[3] += 1;
        break;
      case chartLabels[4]:
        chartData[4] += 1;
        break;
      case chartLabels[5]:
        chartData[5] += 1;
        break;
      default:
        chartData[0] += 1;
        break;
    }
  });

  console.log("token created");

  let success = ["Token criado."];

  const link = `<a href="/register/${token.token}" target="_blank" class="font-semibold underline">Registrar usuário</a>`;
  success.push(link);

  res.render("dashboard", {
    user: req.user,
    schools,
    activeSchools,
    chartData,
    chartLabels,
    success,
  });
};

// GET request for Register page
const registerView = (req, res) => {
  // Check token
  Token.findOne({
    token: req.params.token,
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
const registerUser = (req, res) => {
  const { name, email, password, confirm, token } = req.body;

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
            res.render("register", {
              name,
              email,
              password,
              confirm,
              errors: ["E-mail já cadastrado."],
              token: tokenFound.token,
            });
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
                    res.render("login", { success: ["Cadastro realizado."] });
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
  let errors;
  if (req.flash("error")) {
    errors = [req.flash("error")];
  }
  res.render("login", { errors });
};

//POST Request for Login page
const loginUser = (req, res) => {
  // Authenticate user
  passport.authenticate("local", {
    successRedirect: "/igaie/dashboard",
    failureRedirect: "/igaie/login",
    failureFlash: true,
  })(req, res);
};

// GET Request for new password page
const requestResetPasswordView = (_req, res) => {
  res.render("requestResetPassword", {});
};

// POST Request for new password page
const requestResetPassword = async (req, res) => {
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
            token = await new Token({
              userId: user._id,
              token: crypto.randomBytes(32).toString("hex"),
            }).save();

            console.log("token created");

            // Redefine password page link
            const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;

            // Redefine password mail body
            const html = await ejs.renderFile(
              path.join(__dirname, "../", "views", "resetPasswordMail.ejs"),
              { name: user.name, link: link }
            );

            // Send the email
            const result = await sendEmail(user.email, html);

            console.log(result);

            res.render("login", { success: "E-mail enviado com sucesso." });
          })
          .catch((error) => console.log(error));
      } else {
        console.log("User not found.");

        const errors = ["E-mail não cadastrado."];

        res.render("requestResetPassword", { errors });
      }
    })
    .catch((error) => console.log(error));
};

// Get Request for resetting password
const resetPasswordView = (req, res) => {
  res.render("resetPassword", {
    userId: req.params.userId,
    token: req.params.token,
  });
};

// POST Request for resetting the password
const resetPassword = (req, res) => {
  const { newPassword } = req.body;

  // Check user
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        // Check token
        Token.findOne({
          userId: user._id,
          token: req.params.token,
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
                      res.redirect("igaie/login");
                    })
                    .catch((err) => console.log(err));
                })
              );
            } else {
              console.log("Invalid link or expired.");

              res.redirect("igaie/login");
            }
          })
          .catch((error) => console.log(error));
      } else {
        console.log("Invalid link or expired.");

        res.redirect("igaie/login");
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
      } else {
        console.log("Invalid user ID.");
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
