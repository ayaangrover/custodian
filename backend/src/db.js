const mongoose = require("mongoose");
const Student = require("./models/Student");
const Scan = require("./models/Scan");

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
}

async function ensureInitialStudent() {
  const existing = await Student.findOne({ studentId: "307660" });
  if (existing) return;

  await Student.create({
    name: "Ayaan Grover",
    advisor: "Stephen Baxter",
    studentId: "307660",
    uids: ["e399241a"]
  });
}

function addStudent(data) {
  return Student.create(data);
}

function removeStudent(studentId) {
  return Student.deleteOne({ studentId });
}

function removeAllStudents() {
  return Student.deleteMany({});
}

function getStudents() {
  return Student.find();
}

function findStudentByUID(uid) {
  return Student.findOne({ uids: uid });
}

async function addScan(data) {
  return Scan.create({
    uid: data.uid,
    device: data.device,
    time: data.time ? new Date(data.time) : new Date()
  });
}

function removeScan(id) {
  return Scan.findByIdAndDelete(id);
}

function removeAllScans() {
  return Scan.deleteMany({});
}

async function getScans({ uid, studentId, device }) {
  let scans = [];

  if (studentId) {
    const student = await Student.findOne({ studentId });
    if (!student) return [];
    scans = await Scan.find({ uid: { $in: student.uids } });
  } else {
    const filter = {};
    if (uid) filter.uid = uid;
    if (device) filter.device = device;
    scans = await Scan.find(filter);
  }

  const students = await Student.find();

  return scans
    .sort((a, b) => b.time - a.time)
    .map(scan => {
      const student = students.find(s => s.uids.includes(scan.uid));
      return {
        ...scan.toObject(),
        student: student
          ? { name: student.name, studentId: student.studentId }
          : null
      };
    });
}

module.exports = {
  connectDB,
  ensureInitialStudent,
  addStudent,
  removeStudent,
  removeAllStudents,
  getStudents,
  findStudentByUID,
  addScan,
  removeScan,
  removeAllScans,
  getScans
};