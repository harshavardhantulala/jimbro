const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: String,
  phone: String,
  start: String,
  end: String,
});

module.exports = mongoose.model("Member", memberSchema);
