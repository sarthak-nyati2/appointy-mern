import express from "express";
import multer from "multer";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { auth, allow } from "../middleware/auth.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`)
});
const upload = multer({ storage });

router.get("/profile", auth, allow("patient", "admin"), async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (e) { next(e); }
});

router.put("/profile", auth, allow("patient"), upload.single("profileImage"), async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.profileImage = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user.id, data, { new: true }).select("-password");
    res.json(user);
  } catch (e) { next(e); }
});

router.get("/patients", auth, allow("admin"), async (req, res, next) => {
  try {
    res.json(await User.find({ role: "patient" }).select("-password").sort({ createdAt: -1 }));
  } catch (e) { next(e); }
});

export default router;
