import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    matricula: { type: String, required: true, unique: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    career: { type: String, default: "" },
    email: { type: String, default: "", lowercase: true, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);
