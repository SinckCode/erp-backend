import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";

export function makeCrudController(Model, { populate = "" } = {}) {
  return {
    create: asyncHandler(async (req, res) => {
      const doc = await Model.create(req.body);
      res.status(201).json({ ok: true, data: doc });
    }),

    list: asyncHandler(async (_req, res) => {
      const q = Model.find();
      if (populate) q.populate(populate);
      const data = await q.sort({ createdAt: -1 });
      res.json({ ok: true, data });
    }),

    getById: asyncHandler(async (req, res) => {
      const q = Model.findById(req.params.id);
      if (populate) q.populate(populate);
      const doc = await q;
      if (!doc) throw httpError(404, "No encontrado");
      res.json({ ok: true, data: doc });
    }),

    update: asyncHandler(async (req, res) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!doc) throw httpError(404, "No encontrado");
      res.json({ ok: true, data: doc });
    }),

    remove: asyncHandler(async (req, res) => {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) throw httpError(404, "No encontrado");
      res.json({ ok: true, message: "Eliminado" });
    }),
  };
}
