// Mongoose
const mongoose = require("mongoose");

// Token Schema
const TokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 1, // this is the expiry time in seconds
  },
});

const Token = mongoose.model("Token", TokenSchema);

module.exports = Token;
