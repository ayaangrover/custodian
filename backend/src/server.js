require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {
  connectDB,
  ensureInitialStudent,
  addStudent,
  removeStudent,
  removeAllStudents,
  getStudents,
  addScan,
  removeScan,
  removeAllScans,
  getScans
} = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

function requireAdmin(req, res, next) {
  if (req.headers["x-admin-password"] !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ ok: false });
    return;
  }
  next();
}

app.post("/scan", async (req, res) => {
  const { uid, device } = req.body;
  if (!uid || !device) {
    res.status(400).json({ ok: false });
    return;
  }

  await addScan({ uid, device });
  res.json({ ok: true });
});

app.get("/scans", async (req, res) => {
  const scans = await getScans({
    uid: req.query.uid,
    studentId: req.query.studentId,
    device: req.query.device
  });
  res.json(scans);
});

app.get("/students", async (req, res) => {
  res.json(await getStudents());
});

app.post("/admin/students", requireAdmin, async (req, res) => {
  res.json(await addStudent(req.body));
});

app.delete("/admin/students/:studentId", requireAdmin, async (req, res) => {
  await removeStudent(req.params.studentId);
  res.json({ ok: true });
});

app.delete("/admin/students", requireAdmin, async (req, res) => {
  await removeAllStudents();
  res.json({ ok: true });
});

app.post("/admin/scans", requireAdmin, async (req, res) => {
  res.json(await addScan(req.body));
});

app.delete("/admin/scans/:id", requireAdmin, async (req, res) => {
  await removeScan(req.params.id);
  res.json({ ok: true });
});

app.delete("/admin/scans", requireAdmin, async (req, res) => {
  await removeAllScans();
  res.json({ ok: true });
});

async function start() {
  await connectDB();
  await ensureInitialStudent();

  app.listen(process.env.PORT, () => {
    console.log("Custodian backend running on port", process.env.PORT);
  });
}

start();