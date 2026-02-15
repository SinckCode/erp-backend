import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import { createSale } from "../controllers/sales.controller.js";
import { Sale } from "../models/Sale.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const salesRoutes = Router();
salesRoutes.use(auth);

salesRoutes.post("/", authorize("ADMIN", "VENTAS"), createSale);

salesRoutes.get(
  "/",
  authorize("ADMIN", "VENTAS", "CONSULTA"),
  asyncHandler(async (_req, res) => {
    const data = await Sale.find().sort({ soldAt: -1 });
    res.json({ ok: true, data });
  })
);
