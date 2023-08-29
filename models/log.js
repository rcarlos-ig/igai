// Mongoose
const mongoose = require("mongoose");

// Token Schema
const LogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  msg: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Log = mongoose.model("Log", LogSchema);

module.exports = Log;
