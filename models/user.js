// Mongoose
const mongoose = require("mongoose");

// User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  accesses: {
    type: Number,
    default: 0,
  },
  theme: String,
  lastLogin: Date,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
