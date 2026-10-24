import express from "express";
import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import { auth, allow } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, allow("patient"), async (req, res, next) => {
  try {
    const { doctorId, date, time, paymentMethod } = req.body;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    if (!doctor.available) return res.status(400).json({ message: "Doctor is currently unavailable" });
    const existing = await Appointment.findOne({ doctor: doctorId, date, time, status: { $ne: "cancelled" } });
    if (existing) return res.status(409).json({ message: "This time slot is already booked" });
    const appointment = await Appointment.create({
      patient: req.user.id, doctor: doctorId, date, time,
      amount: doctor.fees, paymentMethod: paymentMethod || "Cash"
    });
    const populated = await appointment.populate("doctor", "name specialty fees image");
    res.status(201).json(populated);
  } catch (e) { next(e); }
});

router.get("/patient", auth, allow("patient"), async (req, res, next) => {
  try {
    res.json(await Appointment.find({ patient: req.user.id }).populate("doctor", "name specialty image fees").sort({ date: -1 }));
  } catch (e) { next(e); }
});

router.get("/doctor", auth, allow("doctor"), async (req, res, next) => {
  try {
    res.json(await Appointment.find({ doctor: req.user.id }).populate("patient", "name email phone gender dateOfBirth").sort({ date: -1 }));
  } catch (e) { next(e); }
});

router.get("/all", auth, allow("admin"), async (req, res, next) => {
  try {
    res.json(await Appointment.find().populate("patient", "name email phone").populate("doctor", "name specialty").sort({ createdAt: -1 }));
  } catch (e) { next(e); }
});

router.put("/:id", auth, async (req, res, next) => {
  try {
    const { status, date, time } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    const isOwner = String(appointment.patient) === String(req.user.id);
    const isDoctor = req.user.role === "doctor" && String(appointment.doctor) === String(req.user.id);
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isDoctor && !isAdmin) return res.status(403).json({ message: "Access denied" });

    if (status) appointment.status = status;
    if (isOwner && date) appointment.date = date;
    if (isOwner && time) appointment.time = time;
    await appointment.save();
    res.json(await appointment.populate(["doctor", "patient"]));
  } catch (e) { next(e); }
});

router.delete("/:id", auth, allow("patient"), async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment || String(appointment.patient) !== String(req.user.id)) return res.status(404).json({ message: "Appointment not found" });
    appointment.status = "cancelled";
    await appointment.save();
    res.json({ message: "Appointment cancelled" });
  } catch (e) { next(e); }
});

export default router;
