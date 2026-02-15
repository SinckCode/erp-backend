import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import { registerIn, registerOut } from "../controllers/attendance.controller.js";
import { AttendanceLog } from "../models/AttendanceLog.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const attendanceRoutes = Router();
attendanceRoutes.use(auth);

attendanceRoutes.post("/in", authorize("ADMIN", "GUARDIA"), registerIn);
attendanceRoutes.post("/out", authorize("ADMIN", "GUARDIA"), registerOut);

attendanceRoutes.get(
  "/",
  authorize("ADMIN", "RH", "CONSULTA"),
  asyncHandler(async (req, res) => {
    const { workerId, from, to } = req.query;

    const q = {};
    if (workerId) q.workerId = workerId;
    if (from || to) {
      q.timestamp = {};
      if (from) q.timestamp.$gte = new Date(from);
      if (to) q.timestamp.$lte = new Date(to);
    }

    const data = await AttendanceLog.find(q)
      .populate("workerId")
      .sort({ timestamp: -1 });

    res.json({ ok: true, data });
  })
);
