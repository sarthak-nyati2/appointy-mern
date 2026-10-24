import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ message: "All fields are required" });
    await Contact.create({ name, email, message });
    res.status(201).json({ message: "Message sent successfully" });
  } catch (e) { next(e); }
});

export default router;
