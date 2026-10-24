import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";

const router = express.Router();
const secret = () => process.env.JWT_SECRET || "change_this_secret";

function tokenFor(id, role) {
  return jwt.sign({ id, role }, secret(), { expiresIn: "7d" });
}

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
    if (await User.findOne({ email })) return res.status(400).json({ message: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, phone, role: "patient" });
    res.status(201).json({ token: tokenFor(user._id, user.role), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { next(e); }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      return res.json({ token: tokenFor(user._id, user.role), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    }
    const doctor = await Doctor.findOne({ email });
    if (doctor && await bcrypt.compare(password, doctor.password)) {
      return res.json({ token: tokenFor(doctor._id, "doctor"), user: { id: doctor._id, name: doctor.name, email: doctor.email, role: "doctor" } });
    }
    res.status(401).json({ message: "Invalid email or password" });
  } catch (e) { next(e); }
});

router.post("/admin-login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin || !(await bcrypt.compare(password, admin.password))) return res.status(401).json({ message: "Invalid admin credentials" });
    res.json({ token: tokenFor(admin._id, "admin"), user: { id: admin._id, name: admin.name, email: admin.email, role: "admin" } });
  } catch (e) { next(e); }
});

export default router;
