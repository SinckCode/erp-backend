import { Position } from "../models/Position.js";
import { Worker } from "../models/Worker.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";

export const removePosition = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const pos = await Position.findById(id);
  if (!pos) throw httpError(404, "No encontrado");

  // 👇 si hay al menos un trabajador con esa posición, NO se borra
  const inUse = await Worker.exists({ positionId: id });
  if (inUse) {
    throw httpError(409, "No se puede eliminar: esta posición está asignada a un trabajador");
  }

  await Position.findByIdAndDelete(id);
  res.json({ ok: true, message: "Eliminado" });
});
