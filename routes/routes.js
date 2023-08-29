// Requirements
const express = require("express");
const { check, validationResult } = require("express-validator");

// Controller Imports
const {
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
  getSchoolsData,
} = require("../controllers/schoolController");
const {
  logging,
  logView,
  getLogsData,
} = require("../controllers/logController");
const { dashboardView } = require("../controllers/dashboardController");
const { chartsDefaultView } = require("../controllers/chartsController");
const { protectRoute, isSuperuser } = require("../controllers/auth/protect");

// Set the Router
const router = express.Router();

// Routes
// Root "/"
router.get("/", protectRoute, dashboardView);

// Register user
router.get("/register", registerView);
router.post(
  "/register",
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
      res.render("register", { errors: errors.array(), token: req.body.token });
    } else {
      next();
    }
  },
  registerUser,
  loginView
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
router.get("/logout", logout);

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
    check("ocupacao")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Ocupação precisa ter 3 caracteres ou mais."),
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("registerSchool", {
        errors: errors.array(),
        user: req.user,
        ativa: true,
      });
    } else {
      req.action = "create";
      req.msg = "Registrada nova unidade.";
      next();
    }
  },
  protectRoute,
  logging,
  registerSchool
);

// School page
router.get("/school", protectRoute, schoolView);
router.post(
  "/school",
  protectRoute,
  schoolPost,
  function (req, _res, next) {
    req.action = "update";
    req.msg = "Indicadores da unidade atualizados.";
    next();
  },
  logging,
  dashboardView
);

// Reset Password
router.get("/resetPassword", requestResetPasswordView);
router.get("/password-reset", resetPasswordView);
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
  requestResetPassword,
  loginView
);
router.post(
  "/password-reset",
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
        userId: req.query.user,
        token: req.query.token,
        errors: errors.array(),
      });
    } else {
      next();
    }
  },
  resetPassword,
  loginView
);

// Edit School
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
        user: req.user,
      });
    } else {
      req.action = "update";
      req.msg = "Dados da unidade atualizados.";
      next();
    }
  },
  protectRoute,
  logging,
  editSchool
);

// Audit Schools
router.get("/audit", protectRoute, auditSchoolView);
router.post("/audit", protectRoute, auditSchool);

// Create Register Token
router.get("/create-token", isSuperuser, createToken, dashboardView);

// Log
router.get("/log", protectRoute, logView);

// User theme
router.post("/user-theme", protectRoute, setUserTheme);

// Charts
router.get("/charts", protectRoute, chartsDefaultView);

// Schools data for tabulator
router.get("/schools-data", protectRoute, getSchoolsData);

// Logs data for tabulator
router.get("/logs-data", protectRoute, getLogsData);

module.exports = router;
