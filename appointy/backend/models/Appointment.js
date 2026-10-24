import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["Cash", "Stripe", "Razorpay"], default: "Cash" },
  status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);
