import { AttendanceLog } from "../models/AttendanceLog.js";
import { Worker } from "../models/Worker.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";

export const registerIn = asyncHandler(async (req, res) => {
  const { workerId, note = "" } = req.body;
  if (!workerId) throw httpError(400, "workerId es obligatorio");

  const worker = await Worker.findById(workerId);
  if (!worker || !worker.active) throw httpError(404, "Trabajador no válido");

  // Validar que no tenga IN sin OUT
  const last = await AttendanceLog.findOne({ workerId }).sort({ timestamp: -1 });
  if (last && last.type === "IN") throw httpError(409, "El trabajador ya tiene una entrada sin salida");

  const log = await AttendanceLog.create({
    workerId,
    type: "IN",
    timestamp: new Date(),
    note,
    createdByUserId: req.user.id,
  });

  res.status(201).json({ ok: true, data: log });
});

export const registerOut = asyncHandler(async (req, res) => {
  const { workerId, note = "" } = req.body;
  if (!workerId) throw httpError(400, "workerId es obligatorio");

  const last = await AttendanceLog.findOne({ workerId }).sort({ timestamp: -1 });
  if (!last || last.type !== "IN") throw httpError(409, "No existe entrada previa sin cerrar");

  const log = await AttendanceLog.create({
    workerId,
    type: "OUT",
    timestamp: new Date(),
    note,
    createdByUserId: req.user.id,
  });

  res.status(201).json({ ok: true, data: log });
});
