import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import { Position } from "../models/Position.js";
import { makeCrudController } from "../controllers/crud.factory.js";

const c = makeCrudController(Position);
export const positionsRoutes = Router();

positionsRoutes.use(auth);
positionsRoutes.get("/", authorize("ADMIN", "RH", "CONSULTA"), c.list);
positionsRoutes.post("/", authorize("ADMIN", "RH"), c.create);
positionsRoutes.get("/:id", authorize("ADMIN", "RH", "CONSULTA"), c.getById);
positionsRoutes.put("/:id", authorize("ADMIN", "RH"), c.update);
positionsRoutes.delete("/:id", authorize("ADMIN"), c.remove);
