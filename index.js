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
const Router = require("./routes/routes");

// DotEnv config
dotenv.config();

// Initialize Express
const app = express();

// Sentry initialization
if (process.env.NODE_ENV === "production") {
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
    tracesSampleRate: 0.7,
    release: "sejin-igaie@" + process.env.npm_package_version,
  });

  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  app.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());
}

// MongoDB Connection
const database = process.env.MONGOLAB_URI;
mongoose
  .connect(database, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("Database Connected."))
  .catch((err) => console.error(err));

// MongoDB Session Store
const store = new MongoDBStore({
  uri: process.env.MONGOLAB_URI,
  collection: "sessions",
});

// Catch MongoDB Session Store errors
store.on("error", function (error) {
  console.error(error);
});

// Compress all responses
app.use(compression());

// Set the View Engine
app.set("view engine", "ejs");

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
app.use("/igaie", Router);

// Set the static folder
if (process.env.NODE_ENV === "production") {
  app.use("/igaie", express.static(__dirname + "/public", { maxAge: "30d" }));
} else {
  app.use(express.static(__dirname + "/public"));
}

// Sentry error handler
if (process.env.NODE_ENV === "production") {
  // The error handler must be before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler());
}

// Server
const port = 3000;
const server = app.listen(port, () =>
  console.log(`Server running on port ${port}.`)
);

// Graceful Shutdown
process.on("SIGTERM", () => {
  console.log(`Server stopping ${new Date().toISOString()}`);
  server.close(() => process.exit());
});

// 404 error handling
app.use((req, res) => {
  res.status(404).render("404", { url: req.url });
});
