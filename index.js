// Requirements
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const http = require("http");
const spdy = require("spdy");
const fs = require("fs");
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
  tracesSampleRate: 0.7,
  release: "sejin-igaie@" + process.env.npm_package_version,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

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

// Set the static folder
app.use(express.static(__dirname + "/public", { maxAge: "30d" }));

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

// Certificate
const privateKey = fs.readFileSync("./ssl/privkey.pem", "utf8");
const certificate = fs.readFileSync("./ssl/fullchain.pem", "utf8");

const credentials = {
  key: privateKey,
  cert: certificate,
};

// Server
spdy.createServer(credentials, app).listen(443, (error) => {
  if (error) {
    console.error(error);
    return process.exit(1);
  } else {
    console.log(`Server started on port 443`);
  }
});

// Redirect from http port 80 to https port 443
http
  .createServer(function (req, res) {
    res.writeHead(301, {
      Location: "https://" + req.headers["host"] + req.url,
    });
    res.end();
  })
  .listen(80, function () {
    console.log("Redirect from HTTP (80) to HTTPS (443) runing.");
  });

// 404 error handling
app.use((req, res) => {
  res.status(404).render("404", { url: req.url });
});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());
