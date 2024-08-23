const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true },
  password: { type: String },
  name: { type: String },
});

module.exports = model("User", userSchema);
