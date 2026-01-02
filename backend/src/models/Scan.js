const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema({
  uid: String,
  device: String,
  time: Date
});

module.exports = mongoose.model("Scan", scanSchema);