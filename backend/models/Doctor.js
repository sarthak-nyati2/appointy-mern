import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  image: { type: String, default: "" },
  specialty: { type: String, required: true },
  degree: { type: String, default: "MBBS" },
  experience: { type: String, default: "5 Years" },
  address: { type: String, default: "" },
  fees: { type: Number, default: 500 },
  description: { type: String, default: "" },
  available: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Doctor", doctorSchema);
