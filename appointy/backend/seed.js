import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Doctor from "./models/Doctor.js";

dotenv.config();

const doctors = [
  ["Dr. Rahul Sharma","rahul@appointy.com","Cardiologist","MBBS, MD","10 Years",800,"Experienced cardiologist focused on preventive heart care."],
  ["Dr. Priya Mehta","priya@appointy.com","Dermatologist","MBBS, MD","8 Years",700,"Specialist in skin, hair and cosmetic dermatology."],
  ["Dr. Amit Verma","amit@appointy.com","General Physician","MBBS, MD","7 Years",500,"Primary care physician for everyday health concerns."],
  ["Dr. Neha Kapoor","neha@appointy.com","Gynecologist","MBBS, MS","9 Years",900,"Women's health and maternity care specialist."],
  ["Dr. Arjun Singh","arjun@appointy.com","Orthopedic","MBBS, MS","12 Years",850,"Orthopedic consultant specializing in joint and bone care."],
  ["Dr. Riya Gupta","riya@appointy.com","Pediatrician","MBBS, MD","6 Years",600,"Caring pediatrician for children's health and development."],
  ["Dr. Karan Malhotra","karan@appointy.com","Neurologist","MBBS, DM","11 Years",1000,"Neurologist focused on brain, nerve and migraine care."],
  ["Dr. Anjali Jain","anjali@appointy.com","Dentist","BDS, MDS","7 Years",600,"Family dentist providing preventive and restorative care."]
];

await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/appointy");
const adminPass = await bcrypt.hash("admin123", 10);
await User.findOneAndUpdate(
  { email: "admin@appointy.com" },
  { name: "Appointy Admin", email: "admin@appointy.com", password: adminPass, role: "admin" },
  { upsert: true, new: true }
);

for (const [name,email,specialty,degree,experience,fees,description] of doctors) {
  const pass = await bcrypt.hash("doctor123", 10);
  await Doctor.findOneAndUpdate(
    { email },
    { name,email,password:pass,specialty,degree,experience,fees,description,available:true },
    { upsert:true, new:true }
  );
}
console.log("Seed complete.");
console.log("Admin: admin@appointy.com / admin123");
console.log("Doctors: any seeded doctor email / doctor123");
await mongoose.disconnect();
