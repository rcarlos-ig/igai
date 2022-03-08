// Requirements
const express = require("express");
const { check, validationResult } = require("express-validator");

// Controller Imports
const {
  createToken,
  registerView,
  loginView,
  registerUser,
  loginUser,
  requestResetPassword,
  requestResetPasswordView,
  resetPassword,
  resetPasswordView,
} = require("../controllers/loginController");
const {
  registerSchool,
  registerSchoolView,
  schoolView,
  schoolPost,
  editSchoolView,
  editSchool,
  auditSchoolView,
  auditSchool,
} = require("../controllers/schoolController");
const { dashboardView } = require("../controllers/dashboardController");
const { protectRoute } = require("../controllers/auth/protect");

// Set the Router
const router = express.Router();

// Routes
// Root "/"
router.get("/", loginView);

// Register user
router.get("/register/:token", registerView);
router.post(
  "/register/:token",
  [
    check("name")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Nome precisa ter 3 caracteres ou mais."),
    check("email")
      .trim()
      .notEmpty()
      .withMessage("E-mail em branco.")
      .bail()
      .isEmail()
      .withMessage("E-mail inválido."),
    check("password")
      .notEmpty()
      .withMessage("Senha em branco.")
      .bail()
      .isLength({ min: 4 })
      .withMessage("Senha precisa ter 4 caracteres ou mais."),
    check("confirm")
      .notEmpty()
      .withMessage("Confirmação de senha em branco.")
      .bail()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("As senhas digitadas não conferem.");
        }
        return true;
      }),
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("register", { errors: errors.array() });
    } else {
      next();
    }
  },
  registerUser
);

// Login
router.get("/login", loginView);
router.post(
  "/login",
  [
    check("email")
      .trim()
      .notEmpty()
      .withMessage("E-mail em branco.")
      .bail()
      .isEmail()
      .withMessage("E-mail inválido."),
    check("password")
      .notEmpty()
      .withMessage("Senha em branco.")
      .bail()
      .isLength({ min: 4 })
      .withMessage("Senha precisa ter mais de 4 caracteres"),
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("login", { errors: errors.array() });
    } else {
      next();
    }
  },
  loginUser
);

// Logout
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/login");
});

// Dashboard
router.get("/dashboard", protectRoute, dashboardView);

// Register School
router.get("/register-school", protectRoute, registerSchoolView);
router.post(
  "/register-school",
  [
    check("codigo")
      .notEmpty()
      .withMessage("Código em branco.")
      .bail()
      .isNumeric()
      .withMessage("Código deve ser numérico."),
    check("nome")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Nome precisa ter 3 caracteres ou mais."),
    check("bairro")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Bairro precisa ter 3 caracteres ou mais."),
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("registerSchool", { errors: errors.array() });
    } else {
      next();
    }
  },
  protectRoute,
  registerSchool
);

// School page
router.get("/school", protectRoute, schoolView);
router.post("/school", protectRoute, schoolPost);

// Reset Password
router.get("/resetPassword", requestResetPasswordView);
router.get("/password-reset/:userId/:token", resetPasswordView);
router.post(
  "/resetPassword",
  [
    check("email")
      .trim()
      .notEmpty()
      .withMessage("E-mail em branco.")
      .bail()
      .isEmail()
      .withMessage("E-mail inválido."),
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("requestResetPassword", { errors: errors.array() });
    } else {
      next();
    }
  },
  requestResetPassword
);
router.post(
  "/password-reset/:userId/:token",
  [
    check("newPassword")
      .notEmpty()
      .withMessage("Senha em branco.")
      .bail()
      .isLength({ min: 4 })
      .withMessage("Senha precisa ter 4 caracteres ou mais."),
    check("verifyPassword")
      .notEmpty()
      .withMessage("Confirmação de senha em branco.")
      .bail()
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error("As senhas digitadas não conferem.");
        }
        return true;
      }),
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("resetPassword", {
        userId: req.params.userId,
        token: req.params.token,
        errors: errors.array(),
      });
    } else {
      next();
    }
  },
  resetPassword
);

//Edit School
router.get("/edit-school", protectRoute, editSchoolView);
router.post(
  "/edit-school",
  [
    check("codigo")
      .notEmpty()
      .withMessage("Código em branco.")
      .bail()
      .isNumeric()
      .withMessage("Código deve ser numérico."),
    check("nome")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Nome precisa ter 3 caracteres ou mais."),
    check("bairro")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Bairro precisa ter 3 caracteres ou mais."),
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("editSchool", {
        school: req.body,
        errors: errors.array(),
      });
    } else {
      next();
    }
  },
  protectRoute,
  editSchool
);

//Audit Schools
router.get("/audit", protectRoute, auditSchoolView);
router.post("/audit", protectRoute, auditSchool);

// Create Register Token
router.get("/create-token", protectRoute, createToken);

module.exports = router;
