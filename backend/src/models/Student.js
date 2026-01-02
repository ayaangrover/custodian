const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  advisor: String,
  studentId: String,
  uids: [String]
});

module.exports = mongoose.model("Student", studentSchema);