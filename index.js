// Requirements
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const { loginCheck } = require("./controllers/auth/passport");

// DotEnv config
dotenv.config();

// Initialize Express
const app = express();

// Mongo DB Connection
const database = process.env.MONGOLAB_URI;
mongoose
  .connect(database, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("Database Connected."))
  .catch((err) => console.log(err));

// Set the View Engine
app.set("view engine", "ejs");

// Set the static folder
app.use(express.static("public"));

// Use 'connect-flash' for flash messages
app.use(flash());

// BodyParsing
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: true,
  })
);

// Passport authentication
loginCheck(passport);
app.use(passport.initialize());
app.use(passport.session());

// Router
app.use("/", require("./routes/routes"));

// Server
const PORT = process.env.PORT || 80;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
