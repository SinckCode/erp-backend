import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    employeeNumber: { type: String, required: true, unique: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    positionId: { type: mongoose.Schema.Types.ObjectId, ref: "Position", required: true },
    email: { type: String, default: "", lowercase: true, trim: true },
    phone: { type: String, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Worker = mongoose.model("Worker", workerSchema);
