import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
    type: { type: String, enum: ["IN", "OUT"], required: true },
    timestamp: { type: Date, required: true },
    note: { type: String, default: "" },
    createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

attendanceSchema.index({ workerId: 1, timestamp: -1 });

export const AttendanceLog = mongoose.model("AttendanceLog", attendanceSchema);
