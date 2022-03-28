// MongoDB Schemas
const Log = require("../models/Log");
const User = require("../models/User");

// Get log
const getLog = async () => {
  return Log.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      return result;
    });
};

const logging = (req, res, next) => {
  const newLog = new Log({
    user: req.user.id,
    action: req.action,
    data: req.body,
    msg: req.msg,
  });

  newLog
    .save()
    .then(next())
    .catch((err) => console.log(err));
};

const logView = async (req, res, next) => {
  let entries = await getLog();
  let users = [];

  for (const entry of entries) {
    const name = await User.findById(entry.user).then((user) => {
      return user.name;
    });
    users.push(name);
  }

  res.render("log", { log: entries, users });
};

module.exports = { logging, logView };
