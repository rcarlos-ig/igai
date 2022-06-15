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

// POST log
const logging = (req, _res, next) => {
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

// GET Request for the log page
const logView = async (req, res) => {
  let entries = await getLog();
  let users = [];

  for (const entry of entries) {
    const name = await User.findById(entry.user).then((user) => {
      return user.name;
    });
    users.push(name);
  }

  res.render("log", { log: entries, users, user: req.user });
};

// GET Request for Tabulator tables
const getLogsData = async (_req, res) => {
  let data = await getLog();
  let finalData = [];

  for (const entry of data) {
    const userName = await User.findById(entry.user).then((user) => {
      return user.name;
    });

    let dataString = "";

    for (const key in entry.data) {
      if (Object.hasOwnProperty.call(entry.data, key)) {
        if (key === "atualizadoEm" || key === "atualizadoPor") continue;
        dataString += `${key}: ${entry.data[key]}<br />`;
      }
    }

    const newValues = {
      createdAt: entry.createdAt.toLocaleDateString("default", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      user: userName,
      action: entry.action,
      msg: entry.msg,
      data: dataString,
    };
    finalData.push(newValues);
  }

  res.send(finalData);
};

module.exports = { logging, logView, getLogsData };
