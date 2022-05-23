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
const bodyParser = require("body-parser");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

// DotEnv config
dotenv.config();

// Initialize Express
const app = express();

// Sentry initialization
Sentry.init({
  dsn: "https://d8529091aa49452b934278a38d3b951d@o1259225.ingest.sentry.io/6433768",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  release: "sejin-igaie@" + process.env.npm_package_version,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

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
app.use(express.static("public", { dotfiles: "allow" }));

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
    resave: true,
    rolling: true,
    cookie: {
      maxAge: 10 * 60 * 1000,
      sameSite: "strict",
    }, // Minutos * Segundos * Milisegundos
  })
);

// Body parser
app.use(bodyParser.json());

// Passport authentication
loginCheck(passport);
app.use(passport.initialize());
app.use(passport.session());

// Router
app.use("/", require("./routes/routes"));

// Server
const PORT = process.env.PORT || 80;
app.listen(PORT, console.log(`Server started on port ${PORT}`));

// Sentry test route
app.get("/debug-sentry", function mainHandler(_req, _res) {
  throw new Error("My first Sentry error!");
});

// 404 error handling
app.use((req, res) => {
  res.status(404).render("404", { url: req.url });
});
