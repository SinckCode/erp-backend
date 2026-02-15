import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import { Worker } from "../models/Worker.js";
import { makeCrudController } from "../controllers/crud.factory.js";

const c = makeCrudController(Worker, { populate: "positionId" });
export const workersRoutes = Router();

workersRoutes.use(auth);
workersRoutes.get("/", authorize("ADMIN", "RH", "CONSULTA"), c.list);
workersRoutes.post("/", authorize("ADMIN", "RH"), c.create);
workersRoutes.get("/:id", authorize("ADMIN", "RH", "CONSULTA"), c.getById);
workersRoutes.put("/:id", authorize("ADMIN", "RH"), c.update);
workersRoutes.delete("/:id", authorize("ADMIN"), c.remove);
