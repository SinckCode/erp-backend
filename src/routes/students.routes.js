import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import { Student } from "../models/Student.js";
import { makeCrudController } from "../controllers/crud.factory.js";

const c = makeCrudController(Student);
export const studentsRoutes = Router();

studentsRoutes.use(auth);
studentsRoutes.get("/", authorize("ADMIN", "RH", "CONSULTA"), c.list);
studentsRoutes.post("/", authorize("ADMIN", "RH"), c.create);
studentsRoutes.get("/:id", authorize("ADMIN", "RH", "CONSULTA"), c.getById);
studentsRoutes.put("/:id", authorize("ADMIN", "RH"), c.update);
studentsRoutes.delete("/:id", authorize("ADMIN"), c.remove);
