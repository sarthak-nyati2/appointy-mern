import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  gender: { type: String, default: "" },
  dateOfBirth: { type: String, default: "" },
  profileImage: { type: String, default: "" },
  role: { type: String, enum: ["patient", "admin"], default: "patient" }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
