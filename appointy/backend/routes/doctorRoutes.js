import express from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import { auth, allow } from "../middleware/auth.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`)
});
const upload = multer({ storage });

router.get("/", async (req, res, next) => {
  try {
    const { search = "", specialty = "" } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (specialty) filter.specialty = specialty;
    res.json(await Doctor.find(filter).select("-password").sort({ createdAt: -1 }));
  } catch (e) { next(e); }
});

router.get("/stats", auth, allow("admin"), async (req, res, next) => {
  try {
    const [doctors, patients, appointments, completed] = await Promise.all([
      Doctor.countDocuments(),
      User.countDocuments({ role: "patient" }),
      Appointment.countDocuments(),
      Appointment.find({ status: "completed" })
    ]);
    res.json({ doctors, patients, appointments, revenue: completed.reduce((s, a) => s + a.amount, 0) });
  } catch (e) { next(e); }
});

router.get("/me/stats", auth, allow("doctor"), async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id }).populate("patient", "name email phone");
    const completed = appointments.filter(a => a.status === "completed");
    const patients = new Set(appointments.map(a => String(a.patient?._id))).size;
    res.json({ earnings: completed.reduce((s, a) => s + a.amount, 0), appointments: appointments.length, patients, latest: appointments.slice(-5).reverse() });
  } catch (e) { next(e); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select("-password");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (e) { next(e); }
});

router.post("/", auth, allow("admin"), upload.single("image"), async (req, res, next) => {
  try {
    const { name, email, password, specialty, degree, experience, address, fees, description, available } = req.body;
    if (!name || !email || !password || !specialty) return res.status(400).json({ message: "Name, email, password and specialty are required" });
    const hashed = await bcrypt.hash(password, 10);
    const doctor = await Doctor.create({
      name, email, password: hashed, specialty, degree, experience, address,
      fees: Number(fees || 500), description, available: available !== "false",
      image: req.file ? `/uploads/${req.file.filename}` : ""
    });
    const obj = doctor.toObject(); delete obj.password;
    res.status(201).json(obj);
  } catch (e) { next(e); }
});

router.put("/:id", auth, allow("admin"), upload.single("image"), async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.fees !== undefined) data.fees = Number(data.fees);
    if (data.available !== undefined) data.available = data.available === "true" || data.available === true;
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    delete data.password;
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, data, { new: true }).select("-password");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (e) { next(e); }
});

router.delete("/:id", auth, allow("admin"), async (req, res, next) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    await Appointment.deleteMany({ doctor: req.params.id });
    res.json({ message: "Doctor deleted" });
  } catch (e) { next(e); }
});

router.get("/me/profile", auth, allow("doctor"), async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.user.id).select("-password");
    res.json(doctor);
  } catch (e) { next(e); }
});

router.put("/me/profile", auth, allow("doctor"), async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.fees !== undefined) data.fees = Number(data.fees);
    if (data.available !== undefined) data.available = Boolean(data.available);
    const doctor = await Doctor.findByIdAndUpdate(req.user.id, data, { new: true }).select("-password");
    res.json(doctor);
  } catch (e) { next(e); }
});

export default router;
