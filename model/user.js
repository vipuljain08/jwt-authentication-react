const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, default: null, required: true, },
  lastName: { type: String, default: null, required: true,},
  email: { type: String, unique: true, required: true,},
  password: { type: String, required: true,},
  token: { type: String },
});

module.exports = mongoose.model("user", userSchema);
