import { Router } from "express";
import { authRoutes } from "./auth.routes.js";
import { positionsRoutes } from "./positions.routes.js";
import { workersRoutes } from "./workers.routes.js";
import { studentsRoutes } from "./students.routes.js";
import { booksRoutes } from "./books.routes.js";
import { attendanceRoutes } from "./attendance.routes.js";
import { salesRoutes } from "./sales.routes.js";

export const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/positions", positionsRoutes);
routes.use("/workers", workersRoutes);
routes.use("/students", studentsRoutes);
routes.use("/books", booksRoutes);
routes.use("/attendance", attendanceRoutes);
routes.use("/sales", salesRoutes);
