// Requirements
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const passport = require("passport");
const { loginCheck } = require("./controllers/auth/passport");
const compression = require("compression");

// DotEnv config
dotenv.config();

// Initialize Express
const app = express();

// MongoDB Connection
const database = process.env.MONGOLAB_URI;
mongoose
  .connect(database, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("Database Connected."))
  .catch((err) => console.log(err));

// MongoDB Session Store
const store = new MongoDBStore({
  uri: process.env.MONGOLAB_URI,
  collection: "sessions",
});

// Catch MongoDB Session Store errors
store.on("error", function (error) {
  console.log(error);
});

// Compress all responses
app.use(compression());

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
    store: store,
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    rolling: true,
    cookie: { maxAge: 10 * 60 * 1000 }, // Minutos * Segundos * Milisegundos
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

// 404 error handling
app.use((req, res, next) => {
  res.status(404).render("404", { url: req.url });
});
