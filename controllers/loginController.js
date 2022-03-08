// MongoDB Schemas
const User = require("../models/User");
const Token = require("../models/Token");

// Requirements
const bcrypt = require("bcryptjs");
const passport = require("passport");
const ejs = require("ejs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const path = require("path");

// Create Register Token
const createToken = async (req, res) => {
  if (req.user.role === "admin") {
    const token = await new Token({
      userId: "6217d8c12bfa7e0528d3174e",
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    console.log("token created");

    res.render("login", { token: token.token, success: "Token criado." });
  }
  res.render("login", { error: "Acesso não autorizado." });
};

// GET request for Register page
const registerView = (req, res) => {
  // Check token
  Token.findOne({
    token: req.params.token,
  }).then((token) => {
    if (token) {
      res.render("register", { token, errors: [""] });
    } else {
      console.log("Invalid link or expired.");
      res.render("login", { error: "Link inválido ou expirado." });
    }
  });
};

// POST Request for Register page
const registerUser = (req, res) => {
  const { name, email, password, confirm } = req.body;

  // Check token
  Token.findOne({
    token: req.params.token,
  }).then((token) => {
    if (token) {
      // Check user
      User.findOne({ email: email }).then((user) => {
        if (user) {
          const emailValidation = "E-mail já cadastrado.";
          res.render("register", {
            name,
            email,
            password,
            confirm,
            emailValidation,
          });
        } else {
          // New user
          const newUser = new User({
            name,
            email,
            password,
            role: "basic",
          });
          //Password Hashing
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save() // Save nes user on database
                .then(res.render("login", { success: "Cadastro realizado." }))
                .catch((err) => console.log(err));
            })
          );
        }
      });
    }
  });
};

// GET request For Login page
const loginView = (req, res) => {
  res.render("login", { error: req.flash("error") });
};

//POST Request for Login page
const loginUser = (req, res) => {
  // Authenticate user
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res);
};

// GET Request for new password page
const requestResetPasswordView = (req, res) => {
  res.render("requestResetPassword", {});
};

// POST Request for new password page
const requestResetPassword = (req, res) => {
  const { email } = req.body;

  // CHeck user
  User.findOne({ email: email }).then((user) => {
    if (user) {
      // Check token
      Token.findOne({ userId: user._id }).then(async (token) => {
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

        console.log("token created", token);

        // Redefine password page link
        const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;

        console.log(link);

        // Redefine password mail body
        const html = await ejs.renderFile(
          path.join(__dirname, "../", "views", "resetPasswordMail.ejs"),
          { name: user.name, link: link }
        );
        
        // Send the email
        sendEmail(user.email, html);

        res.render("login", { success: "E-mail enviado com sucesso." });
      });
    } else {
      console.log("User not found.");

      res.render("login", { error: "E-mail não cadastrado." });
    }
  });
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
  User.findById(req.params.userId).then((user) => {
    if (user) {
      // Check token
      Token.findOne({
        userId: user._id,
        token: req.params.token,
      }).then((token) => {
        if (token) {
          // Pasword hashing
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newPassword, salt, (err, hash) => {
              if (err) throw err;
              user.password = hash;
              user
                .save()
                .then(res.redirect("/login"))
                .catch((err) => console.log(err));
            })
          );
        } else {
          console.log("Invalid link or expired.");

          res.redirect("/login");
        }
      });
    } else {
      console.log("Invalid link or expired.");

      res.redirect("/login");
    }
  });
};

module.exports = {
  createToken,
  registerView,
  loginView,
  registerUser,
  loginUser,
  requestResetPassword,
  requestResetPasswordView,
  resetPassword,
  resetPasswordView,
};
