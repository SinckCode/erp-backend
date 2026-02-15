import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import { Book } from "../models/Book.js";
import { makeCrudController } from "../controllers/crud.factory.js";

const c = makeCrudController(Book);
export const booksRoutes = Router();

booksRoutes.use(auth);
booksRoutes.get("/", authorize("ADMIN", "VENTAS", "CONSULTA"), c.list);
booksRoutes.post("/", authorize("ADMIN", "VENTAS"), c.create);
booksRoutes.get("/:id", authorize("ADMIN", "VENTAS", "CONSULTA"), c.getById);
booksRoutes.put("/:id", authorize("ADMIN", "VENTAS"), c.update);
booksRoutes.delete("/:id", authorize("ADMIN"), c.remove);
