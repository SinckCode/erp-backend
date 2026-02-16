import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/adminUsers.controller.js";

export const adminUsersRoutes = Router();

adminUsersRoutes.use(auth, authorize("ADMIN"));

adminUsersRoutes.get("/", listUsers);
adminUsersRoutes.post("/", createUser);
adminUsersRoutes.put("/:id", updateUser);
adminUsersRoutes.delete("/:id", deleteUser);
